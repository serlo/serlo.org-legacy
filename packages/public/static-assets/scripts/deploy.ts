/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { uploadPackage } from '@serlo/gcloud'
import * as path from 'path'
import { Signale } from 'signale'
import * as util from 'util'
import * as fs from 'fs'
import { publishPackage, shouldDeployPackage } from '@serlo/cloudflare'

const readFile = util.promisify(fs.readFile)

const root = path.join(__dirname, '..')
const srcPath = path.join(__dirname, '..', 'src')
const packageJsonPath = path.join(root, 'package.json')
const fsOptions: { encoding: BufferEncoding } = { encoding: 'utf-8' }
const signale = new Signale({ interactive: true })

run()
  .then(() => {})
  .catch((err) => signale.fatal(err))

async function run() {
  const name = 'serlo-org-static-assets'

  signale.info('Deploying static assets')

  const { version } = await fetchPackageJSON()

  if (!(await shouldDeployPackage({ name, version }))) {
    signale.info(`Skipping deployment of ${name}@${version}`)
    return
  }

  signale.info(`Deploying ${name}@${version}`)

  signale.pending('Uploading package…')
  uploadPackage({ source: srcPath, name, version })

  signale.pending('Publishing package…')
  await publishPackage({ name, version })

  signale.success(`Successfully deployed ${name}@${version}`)
}

async function fetchPackageJSON(): Promise<{ version: string }> {
  return JSON.parse(await readFile(packageJsonPath, fsOptions))
}
