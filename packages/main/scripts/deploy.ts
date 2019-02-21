/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import { zoneId, cloudflare } from '@serlo/cloudflare'
import { uploadFolder } from '@serlo/gcloud'
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as os from 'os'
import * as path from 'path'
import * as R from 'ramda'
import * as semver from 'semver'
import { Signale } from 'signale'
import * as util from 'util'

const root = path.join(__dirname, '..')
const distPath = path.join(__dirname, '..', 'dist')

enum Environment {
  blue = 'a',
  green = 'b'
}

const gcloudProject = `--project=serlo-assets`
const gcloudStorageOptions = {
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
    const { version, environment } = await prompt(packageJSON)

    signale.pending(`Bundling…`)
    await build({ environment, packageJSON })

    signale.pending(`Uploading bundle…`)
    await uploadBundle(environment)

    signale.pending(`Flushing Cloudflare cache…`)
    await flushCache(environment)

    signale.pending(`Deploying Google Cloud Function…`)
    deployGcf(environment)

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
  ])
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
  await uploadFolder({
    bucket: gcloudStorageOptions.bucket,
    source: distPath,
    target: `athene2-assets@${environment}`
  })
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
      gcloudProject
    ],
    { stdio: 'inherit' }
  )
}
