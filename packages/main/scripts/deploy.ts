/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { zoneId, cloudflare } from '@serlo/cloudflare'
import { uploadFolder } from '@serlo/gcloud'
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
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

const gcloudStorageOptions = {
  bucket: 'packages.serlo.org'
}

const packageJsonPath = path.join(root, 'package.json')

const fsOptions = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

const signale = new Signale({ interactive: true })

run()

async function run() {
  try {
    signale.info('Deploying athene2-assets')

    const packageJSON = await fetchPackageJSON()
    const { version, environment } = await prompt(packageJSON)

    signale.pending(`Bundling…`)
    build({ environment, packageJSON })

    signale.pending(`Uploading bundle…`)
    await uploadBundle(environment)

    signale.pending(`Flushing Cloudflare cache…`)
    await flushCache(environment)

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
      validate: (input: string) => {
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

function build({
  environment
}: {
  environment: Environment
  packageJSON: unknown
}) {
  spawnSync(
    'yarn',
    [
      'build:assets',
      `--output-public-path=https://packages.serlo.org/athene2-assets@${environment}/`
    ],
    { stdio: 'inherit' }
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
  const webpackConfig: {
    entry: { [key: string]: unknown }
  } = require('../webpack.base.config')
  const entries = R.keys(webpackConfig.entry) as string[]
  const exts = ['js', 'js.map', 'css']
  const files = R.map<R.KeyValuePair<string, string>, string>(
    ([entry, ext]) => `${prefix}${entry}.${ext}`,
    R.xprod<string, string>(entries, exts)
  )
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
