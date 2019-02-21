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
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const readdir = util.promisify(fs.readdir)

export async function uploadFolder({
  bucket,
  source,
  target
}: {
  bucket: string
  source: string
  target: string
}) {
  const b = `gs://${bucket}`
  const dest = `${b}/${trimSlashes(target)}/`
  const tmp = `${b}/${trimSlashes(target)}-tmp/`

  spawnSync(`gsutil`, ['-m', 'cp', '-r', path.join(source, '*'), tmp], {
    stdio: 'inherit'
  })
  spawnSync(`gsutil`, ['-m', 'rm', '-r', dest], { stdio: 'inherit' })

  const items = await readdir(source)

  items.forEach(item => {
    spawnSync(`gsutil`, ['-m', 'mv', `${tmp}${item}`, dest], {
      stdio: 'inherit'
    })
  })
  spawnSync(`gsutil`, ['-m', 'rm', '-r', tmp], { stdio: 'inherit' })

  function trimSlashes(p: string) {
    return p.replace(/^\/+/, '').replace('//+$/', '')
  }
}
