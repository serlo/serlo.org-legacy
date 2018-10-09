import { Storage } from '@google-cloud/storage'
import { spawnSync } from 'child_process'
// @ts-ignore
import * as createCloudflare from 'cloudflare'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as os from 'os'
import * as path from 'path'
import * as R from 'ramda'
import * as semver from 'semver'
import { Signale } from 'signale'
import * as util from 'util'
// @ts-ignore
import * as runAll from 'npm-run-all'

const root = path.join(__dirname, '..')

enum Environment {
  blue = 'a',
  green = 'b'
}

const cloudflareOptions = {
  zoneId: '1a4afa776acb2e40c3c8a135248328ae'
}

const gcloudOptions = {
  projectId: 'serlo-assets',
  keyFilename: path.join(root, 'gcloud.secret.json')
}

const gCloudStorageOptions = {
  bucket: 'packages.serlo.org'
}

const packageJsonPath = path.join(root, 'package.json')
const gcfDir = path.join(root, 'dist-gcf')

const fsOptions = { encoding: 'utf-8' }

const readDir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const signale = new Signale({ interactive: true })
const numberOfSteps = 5

run()

async function run() {
  try {
    signale.info('Deploying athene2-assets')

    const packageJSON = await fetchPackageJSON()
    const { version, environment } = await prompt(packageJSON)

    signale.pending(`[0/${numberOfSteps}]: Incrementing…`)
    await incrementVersion({ version, packageJSON })

    signale.pending(`[1/${numberOfSteps}]: Bundling…`)
    await build(packageJSON)

    signale.pending(`[2/${numberOfSteps}]: Uploading bundle…`)
    const files = await uploadBundle(environment)
    // // TODO: verify successful upload of bundle

    signale.pending(`[3/${numberOfSteps}]: Flushing Cloudflare cache…`)
    await flushCache(files)
    // TODO: verify package-registry/athene2-assets@major (to fill cache and verify deployment)

    signale.pending(
      `[4/${numberOfSteps}]: Deploying Google Cloud Function Cloudflare cache…`
    )
    deployGCF(environment)

    signale.pending(
      `[5/${numberOfSteps}]: Successfully deployed athene2-assets@${version} (${environment})`
    )
  } catch (e) {
    signale.fatal(e.message)
  }
}

function fetchPackageJSON(): unknown {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

async function prompt(packageJSON: unknown) {
  const { version } = packageJSON as { version: string }

  return inquirer.prompt<{
    version: string
    environment: Environment
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

async function build(packageJSON: unknown): Promise<void> {
  await runAll(['build:*'], { parallel: true })

  return Promise.resolve(packageJSON as { dependencies: unknown })
    .then(R.prop('dependencies'))
    .then(dependencies => JSON.stringify({ dependencies }, null, 2))
    .then(data =>
      writeFile(path.join(gcfDir, 'package.json'), data + os.EOL, fsOptions)
    )
}

async function uploadBundle(environment: Environment): Promise<string[]> {
  const storage = new Storage(gcloudOptions)
  const bucket = storage.bucket(gCloudStorageOptions.bucket)

  const distPath = path.join(__dirname, '..', 'dist')
  const files = await readDir(distPath)
  const prefix = `athene2-assets@${environment}/`

  await bucket.deleteFiles({
    prefix
  })

  await Promise.all(
    R.map(file => {
      return bucket.upload(path.join(distPath, file), {
        destination: `${prefix}${file}`
      })
    }, files)
  )

  return R.map(file => `${prefix}${file}`, files)
}

async function flushCache(files: string[]): Promise<void> {
  // @ts-ignore
  const cloudflare = createCloudflare(require('../cloudflare.secret.json'))

  const urls = R.splitEvery(
    30,
    R.map(file => `https://packages.serlo.org/${file}`, files)
  )

  await Promise.all(
    R.map(files => {
      return cloudflare.zones.purgeCache(cloudflareOptions.zoneId, {
        files
      })
    }, urls)
  )
}

function deployGCF(environment: Environment): void {
  spawnSync('gcloud', [
    'auth',
    'activate-service-account',
    `--key-file=${gcloudOptions.keyFilename}`
  ])

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
      `--project=${gcloudOptions.projectId}`
    ],
    { stdio: 'inherit' }
  )
}
