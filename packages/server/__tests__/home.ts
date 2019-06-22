/*
 * This file is part of Athene2.
 *
 * Copyright (c) 2013-2018 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
import { Browser, launch, Page } from 'puppeteer'

const seconds = 1000
jest.setTimeout(60 * seconds)

describe('Home', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await launch()
  })

  beforeEach(async () => {
    page = await browser.newPage()
  })

  test('de.serlo.localhost has the correct document title', async () => {
    await page.goto('http://de.serlo.localhost:4567/')
    const title = await getTitle(page)
    expect(title).toEqual('Serlo – Die freie Lernplattform')
  })

  test('en.serlo.localhost has the correct document title', async () => {
    await page.goto('http://en.serlo.localhost:4567/')
    const title = await getTitle(page)
    expect(title).toEqual('Serlo – The Open Learning Platform')
  })

  test('es.serlo.localhost has the correct document title', async () => {
    await page.goto('http://es.serlo.localhost:4567/')
    const title = await getTitle(page)
    expect(title).toEqual('Serlo – La Plataforma para el Aprendizaje Abierto')
  })

  test('hi.serlo.localhost has the correct document title', async () => {
    await page.goto('http://hi.serlo.localhost:4567/')
    const title = await getTitle(page)
    expect(title).toEqual('सेर्लो – ओपन लर्निंग प्लेटफॉर्म')
  })
})

async function getTitle(page: Page): Promise<string> {
  return await page.evaluate(() => {
    return document.title
  })
}
