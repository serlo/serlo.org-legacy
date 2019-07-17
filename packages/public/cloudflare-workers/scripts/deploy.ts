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
import { uploadWorker } from '@serlo/cloudflare'
import * as fs from 'fs'
import * as path from 'path'
import { Signale } from 'signale'
import * as util from 'util'

const readFile = util.promisify(fs.readFile)

const fsOptions = { encoding: 'utf-8' }

const signale = new Signale({ interactive: true })

run().then(() => {})

async function run() {
  try {
    signale.info('Deploying Cloudflare workers')

    await uploadWorkers()

    signale.success('Successfully deployed Cloudflare workers')
  } catch (e) {
    signale.fatal(e)
    throw e
  }
}

async function uploadWorkers(): Promise<void> {
  const content = await readFile(
    path.join(__dirname, '..', 'dist', 'index.js'),
    fsOptions
  )
  await uploadWorker({
    name: 'serlo',
    body: content
  })
}
