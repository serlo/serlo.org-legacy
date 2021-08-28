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
import { spawnSync } from 'child_process'
import * as path from 'path'
import { Signale } from 'signale'

const bucket = 'packages.serlo.org'
const signale = new Signale({ interactive: true })

export function uploadPackage({
  source,
  name,
  version,
}: {
  source: string
  name: string
  version: string
}) {
  const target = `${name}@${version}`

  if (target.includes('/'))
    throw new Error(`package ${target} contains a slash in the name or version`)

  const dest = `gs://${bucket}/${target}/`

  if (spawnSync('gsutil', ['ls', dest]).status === 0) {
    signale.info('Destination folder already exists')
    return
  }

  const copyArgs = ['-m', 'cp', '-r', path.join(source, '*'), dest]
  const copyResult = spawnSync('gsutil', copyArgs, { stdio: 'inherit' })

  if (copyResult.status !== 0)
    throw new Error(`Error while copying ${source} to ${dest}`)
}
