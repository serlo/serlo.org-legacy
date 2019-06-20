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
import { cloudflare, zoneId } from '@serlo/cloudflare'
import { uploadFolder } from '@serlo/gcloud'
import { execFile } from 'child_process'
import * as path from 'path'
import * as R from 'ramda'
import { Signale } from 'signale'

const bucket = 'assets.serlo.org'
const source = path.join(__dirname, '..', 'src')

const signale = new Signale({ interactive: true })

run()

async function run() {
  try {
    signale.info('Deploying static assets')
    await uploadFolder({
      bucket,
      source,
      target: 'athene2-assets'
    })

    signale.pending(`Flushing Cloudflare cache…`)
    await flushCache()

    signale.success(`Successfully deployed static assets`)
  } catch (e) {
    signale.fatal(e)
  }
}

async function flushCache(): Promise<void> {
  const prefix = `athene2-assets/`

  const files = await new Promise<string[]>(resolve => {
    execFile('find', ['src'], function(_err: unknown, stdout: string) {
      const files = stdout.split('\n')
      resolve(files.map(file => file.replace('src/', '')))
    })
  })

  const urls = R.splitEvery(
    30,
    R.map(file => `https://assets.serlo.org/${prefix}${file}`, files)
  )

  await Promise.all(
    R.map(files => {
      return cloudflare.zones.purgeCache(zoneId, {
        files
      })
    }, urls)
  )
}
