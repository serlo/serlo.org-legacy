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
import { publishPackage } from '@serlo/cloudflare'
import { uploadFolder } from '@serlo/gcloud'
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { Signale } from 'signale'
import * as util from 'util'

const root = path.join(__dirname, '..')
const distPath = path.join(__dirname, '..', 'dist')

const gcloudStorageOptions = {
  bucket: 'packages.serlo.org'
}

const packageJsonPath = path.join(root, 'package.json')

const fsOptions = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

const signale = new Signale({ interactive: true })

run().then(() => {})

async function run() {
  try {
    signale.info('Deploying athene2-assets')

    const { version } = await fetchPackageJSON()

    signale.pending(`Bundling…`)
    build()

    signale.pending(`Uploading bundle…`)
    uploadBundle(version)

    signale.pending(`Publishing package…`)
    await publish(version)

    signale.success(`Successfully deployed athene2-assets@${version}`)
  } catch (e) {
    signale.fatal(e.message)
  }
}

function fetchPackageJSON(): Promise<{ version: string }> {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

function build() {
  spawnSync('yarn', ['build'], {
    stdio: 'inherit'
  })
}

function uploadBundle(version: string) {
  uploadFolder({
    bucket: gcloudStorageOptions.bucket,
    source: distPath,
    target: `athene2-assets@${version}`
  })
}

async function publish(version: string) {
  await publishPackage({
    name: 'athene2-assets',
    version
  })
}
