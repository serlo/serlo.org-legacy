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
import { accountId, secret } from '@serlo/cloudflare'
import * as fs from 'fs'
// @ts-ignore
import runAll from 'npm-run-all'
import * as path from 'path'
import * as request from 'request'
import { Signale } from 'signale'
import * as util from 'util'

const readFile = util.promisify(fs.readFile)

const fsOptions = { encoding: 'utf-8' }

const signale = new Signale({ interactive: true })
const numberOfSteps = 2

run()

async function run() {
  try {
    signale.info('Deploying Cloudflare workers')

    signale.pending(`[0/${numberOfSteps}]: Bundling…`)
    await build()

    signale.pending(`[1/${numberOfSteps}]: Uploading workers…`)
    await uploadWorkers()

    signale.success(
      `[2/${numberOfSteps}]: Successfully deployed Cloudflare workers`
    )
  } catch (e) {
    signale.fatal(e)
  }
}

async function build(): Promise<void> {
  return runAll(['build'], {
    parallel: true,
    stdout: process.stdout,
    stderr: process.stderr
  })
}

async function uploadWorkers(): Promise<void> {
  const content = await readFile(
    path.join(__dirname, '..', 'dist', 'index.js'),
    fsOptions
  )
  await new Promise((resolve, reject) => {
    request.put(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/serlo`,
      {
        headers: {
          'X-Auth-Email': secret.email,
          'X-Auth-Key': secret.key,
          'Content-Type': 'application/javascript'
        },
        body: content
      },
      error => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      }
    )
  })
}
