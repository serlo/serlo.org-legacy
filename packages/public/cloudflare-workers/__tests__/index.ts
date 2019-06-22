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

let worker: { dispatch(req: Request): Promise<Response> }
beforeAll(async () => {
  spawnSync('yarn', ['build'], {
    cwd: root,
    stdio: 'inherit'
  })
  const script = `
    const PACKAGES_KV = {
      get(key) {
        if (key === 'athene2-assets@4')
          return Promise.resolve('athene2-assets@4.1.3')
        if (key === 'athene2-assets@4.1')
          return Promise.resolve('athene2-assets@4.1.3')
        if (key === 'athene2-assets@4.1.3')
          return Promise.resolve('athene2-assets@4.1.3')
        if (key === 'static-assets@1')
          return Promise.resolve('static-assets@1.0.0')
        if (key === 'static-assets@1.0')
          return Promise.resolve('static-assets@1.0.0')
        if (key === 'static-assets@1.0.0')
          return Promise.resolve('static-assets@1.0.0')
        return Promise.resolve(null)
      }
    }
    ${await readFile(path.join(root, 'dist', 'index.js'), {
      encoding: 'utf-8'
    })}
  `
  worker = (new Cloudworker(script) as unknown) as {
    dispatch(req: Request): Promise<Response>
  }
})

describe('Redirects', () => {
  test('start.serlo.org', async () => {
    const req = new Cloudworker.Request('https://start.serlo.org')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(
      res,
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/'
    )
  })

  test('de.serlo.org/labschool', async () => {
    const req = new Cloudworker.Request('https://de.serlo.org/labschool')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(res, 'https://labschool.serlo.org')
  })

  test('de.serlo.org/hochschule', async () => {
    const req = new Cloudworker.Request('https://de.serlo.org/hochschule')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(res, 'https://de.serlo.org/mathe/universitaet/44323')
  })

  test('de.serlo.org/beitreten', async () => {
    const req = new Cloudworker.Request('https://de.serlo.org/beitreten')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(
      res,
      'https://docs.google.com/forms/d/e/1FAIpQLSdEoyCcDVP_G_-G_u642S768e_sxz6wO6rJ3tad4Hb9z7Slwg/viewform'
    )
  })

  test('serlo.org', async () => {
    const req = new Cloudworker.Request('https://serlo.org/mathe')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(res, 'https://de.serlo.org/mathe')
  })

  test('www.serlo.org', async () => {
    const req = new Cloudworker.Request('https://www.serlo.org/mathe')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(res, 'https://de.serlo.org/mathe')
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

describe('Enforce HTTPS', () => {
  test('serlo.org', async () => {
    const req = new Cloudworker.Request('http://de.serlo.org/mathe')
    const res = await worker.dispatch(req)
    isTemporaryRedirectTo(res, 'https://de.serlo.org/mathe')
  })
})

describe('Deny direct access to serlo.education', () => {
  test('serlo.education', async () => {
    const req = new Cloudworker.Request('https://serlo.education/robots.txt')
    const res = await worker.dispatch(req)
    expect(res.status).toEqual(403)
  })

  test('de.serlo.education', async () => {
    const req = new Cloudworker.Request('https://de.serlo.education/mathe')
    const res = await worker.dispatch(req)
    expect(res.status).toEqual(403)
  })
})

describe('Packages', () => {
  test('athene2-assets@4', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/athene2-assets@4/main.js'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/athene2-assets@4.1.3/main.js'
    )
  })

  test('athene2-assets@4.1', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/athene2-assets@4.1/main.js'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/athene2-assets@4.1.3/main.js'
    )
  })

  test('athene2-assets@4.1.3', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/athene2-assets@4.1.3/main.js'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/athene2-assets@4.1.3/main.js'
    )
  })

  test('static-assets@1', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/static-assets@1/de/home/about-serlo.svg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/static-assets@1.0.0/de/home/about-serlo.svg'
    )
  })

  test('static-assets@1.0', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/static-assets@1.0/de/home/about-serlo.svg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/static-assets@1.0.0/de/home/about-serlo.svg'
    )
  })

  test('static-assets@1.0.0', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/static-assets@1.0.0/de/home/about-serlo.svg'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/static-assets@1.0.0/de/home/about-serlo.svg'
    )
  })

  test('athene2-assets@a', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/athene2-assets@a/main.js'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/athene2-assets@a/main.js'
    )
  })

  test('athene2-assets@b', async () => {
    const req = new Cloudworker.Request(
      'https://packages.serlo.org/athene2-assets@b/main.js'
    )
    const res = await worker.dispatch(req)
    isSuccessfulFetchOf(
      res,
      'https://packages.serlo.org/athene2-assets@b/main.js'
    )
  })
})

function isTemporaryRedirectTo(res: Response, url: string) {
  expect(res.status).toEqual(302)
  expect(res.headers.get('Location')).toEqual(url)
}

function isSuccessfulFetchOf(res: Response, url: string) {
  expect(res.status).toEqual(200)
  expect(res.url).toEqual(url)
}
