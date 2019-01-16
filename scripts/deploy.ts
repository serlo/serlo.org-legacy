import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as os from 'os'
import * as path from 'path'
import * as R from 'ramda'
import * as semver from 'semver'
import { Signale } from 'signale'
import * as util from 'util'

import { zoneId, cloudflare } from './cloudflare'
import { project } from './gcloud'

const root = path.join(__dirname, '..')
const distPath = path.join(__dirname, '..', 'dist')

enum Environment {
  blue = 'a',
  green = 'b'
}

const gCloudStorageOptions = {
  bucket: 'packages.serlo.org'
}

const packageJsonPath = path.join(root, 'package.json')
const gcfDir = path.join(root, 'dist-gcf')

const fsOptions = { encoding: 'utf-8' }

const copyFile = util.promisify(fs.copyFile)
const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const signale = new Signale({ interactive: true })

run()

async function run() {
  try {
    signale.info('Deploying athene2-assets')

    const packageJSON = await fetchPackageJSON()
    const { version, environment, steps } = await prompt(packageJSON)

    signale.pending(`Incrementing version…`)
    await incrementVersion({ version, packageJSON })

    if (R.contains('build', steps)) {
      signale.pending(`Bundling…`)
      await build({ environment, packageJSON })
    }

    if (R.contains('upload', steps)) {
      signale.pending(`Uploading bundle…`)
      await uploadBundle(environment)
    }

    // TODO: verify successful upload

    if (R.contains('flush', steps)) {
      signale.pending(`Flushing Cloudflare cache…`)
      await flushCache(environment)
    }

    // TODO: verify https://packages.serlo.org/athene2-assets@major (to warm up cache and verify deployment)

    if (R.contains('sentry-release', steps)) {
      signale.pending('Creating sentry release')
      createSentryRelease(version)
    }

    if (R.contains('deploy-gcf', steps)) {
      signale.pending(`Deploying Google Cloud Function…`)
      deployGcf(environment)
    }

    signale.success(
      `Successfully deployed athene2-assets@${version} (${environment})`
    )
  } catch (e) {
    signale.fatal(e.message)
  }
}

function fetchPackageJSON(): unknown {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

function prompt(packageJSON: unknown) {
  const { version } = packageJSON as { version: string }

  return inquirer.prompt<{
    version: string
    environment: Environment
    steps: string[]
  }>([
    {
      name: 'version',
      message: 'Version',
      default: version,
      validate: input => {
        if (semver.valid(input)) {
          return true
        }

        return `${input} is not a valid version number (MAJOR.MINOR.PATCH)`
      }
    },
    {
      name: 'environment',
      message: 'Environment',
      type: 'list',
      choices: R.values(
        R.mapObjIndexed((value, name) => {
          return { value, name }
        }, Environment)
      )
    },
    {
      name: 'steps',
      message: 'Steps',
      type: 'checkbox',
      choices: [
        {
          name: 'Bundle',
          value: 'build',
          checked: true
        },
        {
          name: 'Upload bundle',
          value: 'upload',
          checked: true
        },
        {
          name: 'Flush cache',
          value: 'flush',
          checked: true
        },
        {
          name: 'Create Sentry release',
          value: 'sentry-release',
          checked: true
        },
        {
          name: 'Deploy Google Cloud Function',
          value: 'deploy-gcf',
          checked: true
        }
      ]
    }
  ])
}

function incrementVersion({
  version,
  packageJSON
}: {
  version: string
  packageJSON: unknown
}): Promise<void> {
  return Promise.resolve(packageJSON)
    .then(R.assoc('version', version))
    .then(value => JSON.stringify(value, null, 2))
    .then(data => writeFile(packageJsonPath, data + os.EOL, fsOptions))
}

async function build({
  environment,
  packageJSON
}: {
  environment: Environment
  packageJSON: unknown
}): Promise<void> {
  spawnSync(
    'yarn',
    [
      'build:assets',
      `--output-public-path=https://packages.serlo.org/athene2-assets@${environment}/`
    ],
    { stdio: 'inherit' }
  )

  spawnSync('yarn', ['build:gcf'], { stdio: 'inherit' })

  return Promise.resolve(packageJSON as { dependencies: unknown })
    .then(R.prop('dependencies'))
    .then(dependencies => JSON.stringify({ dependencies }, null, 2))
    .then(data =>
      writeFile(path.join(gcfDir, 'package.json'), data + os.EOL, fsOptions)
    )
    .then(() =>
      copyFile(path.join(root, 'yarn.lock'), path.join(gcfDir, 'yarn.lock'))
    )
}

async function uploadBundle(environment: Environment): Promise<void> {
  const prefix = `athene2-assets@${environment}`
  const bucket = `gs://${gCloudStorageOptions.bucket}`
  const dest = `${bucket}/${prefix}/`
  const tmp = `${bucket}/${prefix}-tmp/`

  spawnSync(`gsutil`, ['-m', 'cp', '-r', path.join(distPath, '*'), tmp], {
    stdio: 'inherit'
  })
  spawnSync(`gsutil`, ['-m', 'rm', '-r', dest], { stdio: 'inherit' })
  spawnSync(`gsutil`, ['-m', 'mv', `${tmp}*`, dest], { stdio: 'inherit' })
}

async function flushCache(environment: Environment): Promise<void> {
  const prefix = `athene2-assets@${environment}/`
  const files = await readDir(distPath).then(R.map(file => `${prefix}${file}`))

  const urls = R.splitEvery(
    30,
    R.map(file => `https://packages.serlo.org/${file}`, files)
  )

  await Promise.all(
    R.map(files => {
      return cloudflare.zones.purgeCache(zoneId, {
        files
      })
    }, urls)
  )
}

function createSentryRelease(version: string): void {
  const release = `athene2-assets@${version}`

  const env = {
    SENTRY_AUTH_TOKEN: require('../sentry.secret.json'),
    SENTRY_ORG: 'serlo'
  }

  spawnSync(
    'sentry-cli',
    ['releases', 'new', '--project', 'athene2-assets', release],
    {
      env,
      stdio: 'inherit'
    }
  )

  spawnSync('sentry-cli', ['releases', 'set-commits', '--auto', release], {
    env,
    stdio: 'inherit'
  })
}

function deployGcf(environment: Environment): void {
  spawnSync(
    'gcloud',
    [
      'functions',
      'deploy',
      `editor-renderer-${environment}`,
      '--region=europe-west1',
      '--entry-point=render',
      '--memory=256MB',
      '--runtime=nodejs8',
      `--source=${gcfDir}`,
      '--trigger-http',
      project
    ],
    { stdio: 'inherit' }
  )
}
