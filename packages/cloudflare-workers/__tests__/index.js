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
/* eslint-env jest */
import Cloudworker from '@dollarshaveclub/cloudworker'
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import util from 'util'

const root = path.join(__dirname, '..')
const readFile = util.promisify(fs.readFile)
let worker
beforeAll(async () => {
  spawnSync('yarn', ['build'], { cwd: root })
  const script = await readFile(path.join(root, 'dist', 'index.js'), {
    encoding: 'utf-8'
  })
  worker = new Cloudworker(script)
})

describe('Redirects', () => {
  test('start.serlo.org (https)', async () => {
    const req = new Cloudworker.Request('https://start.serlo.org')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(
      res,
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/'
    )
  })

  test('start.serlo.org (http)', async () => {
    const req = new Cloudworker.Request('http://start.serlo.org')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(
      res,
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/'
    )
  })
})

describe('Semantic file names for assets', () => {
  test('Semantic file name', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/5d08f913b355d_4809808eeb8b826be8dcabf2f69f7780e3f67adb/app-store.png'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://assets.serlo.org/5d08f913b355d_4809808eeb8b826be8dcabf2f69f7780e3f67adb.png'
    )
  })

  test('Semantic file name (legacy)', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/legacy/57fcd11f8b958_0d3d714f369bcaf675b72775c77b67fdb795dd2e/uni-bayreuth.png'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://assets.serlo.org/legacy/57fcd11f8b958_0d3d714f369bcaf675b72775c77b67fdb795dd2e.png'
    )
  })

  test('Non-semantic file name', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/5d08f913b355d_4809808eeb8b826be8dcabf2f69f7780e3f67adb.png'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://assets.serlo.org/5d08f913b355d_4809808eeb8b826be8dcabf2f69f7780e3f67adb.png'
    )
  })

  test('Non-semantic file name (legacy)', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/legacy/57fcd11f8b958_0d3d714f369bcaf675b72775c77b67fdb795dd2e.png'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://assets.serlo.org/legacy/57fcd11f8b958_0d3d714f369bcaf675b72775c77b67fdb795dd2e.png'
    )
  })

  test('Meta directory', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/meta/serlo.jpg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(res, 'https://assets.serlo.org/meta/serlo.jpg')
  })

  test('Meta subdirectory', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/meta/de/mathematik.jpg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(res, 'https://assets.serlo.org/meta/de/mathematik.jpg')
  })

  test('Athene2-assets subdirectory', async () => {
    const req = new Cloudworker.Request(
      'https://assets.serlo.org/athene2-assets/de/home/about-serlo.svg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://assets.serlo.org/athene2-assets/de/home/about-serlo.svg'
    )
  })
})

function isTemporaryRedirectTo(res, url) {
  expect(res.status).toEqual(302)
  expect(res.headers.get('Location')).toEqual(url)
}

function isSuccessfulFetchOf(res, url) {
  expect(res.status).toEqual(200)
  expect(res.url).toEqual(url)
}
