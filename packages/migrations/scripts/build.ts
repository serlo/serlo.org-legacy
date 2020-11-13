/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
// @ts-ignore FIXME
import build from '@vercel/ncc'
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

const root = path.join(__dirname, '..')
const src = path.join(root, 'src')
const dist = path.join(root, 'dist')

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  const createDir = util.promisify(fs.mkdir)
  const readDir = util.promisify(fs.readdir)
  const writeFile = util.promisify(fs.writeFile)
  const rmDir = util.promisify(rimraf)
  const stat = util.promisify(fs.stat)

  await rmDir(dist)
  await createDir(dist)
  const files = await readDir(src)
  await Promise.all(
    files.map(async (file) => {
      const stats = await stat(path.join(src, file))
      if (!stats.isFile()) return

      const { code } = await build(path.join(src, file), {
        cache: false,
        sourceMapRegister: false,
      })
      await writeFile(
        path.join(dist, `${path.basename(file, '.ts')}.js`),
        code,
        {
          encoding: 'utf-8',
        }
      )
    })
  )
}
