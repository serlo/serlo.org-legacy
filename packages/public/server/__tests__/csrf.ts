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

describe('CSRF', () => {
  let browser: Browser
  let homePage: Page
  let loginPage: Page

  beforeAll(async () => {
    browser = await launch()
    homePage = await browser.newPage()
    await homePage.goto('http://de.serlo.localhost:4567')
    loginPage = await browser.newPage()
    await loginPage.goto('http://de.serlo.localhost:4567/auth/login')
  })

  test('home has a CSRF token on `window.csrf`', async () => {
    const homeCsrf = await getWindowCsrf(homePage)
    expect(typeof homeCsrf).toEqual('string')
  })

  test(`home page has the same token on \`window.csrf\` as login page`, async () => {
    const homeCsrf = await getWindowCsrf(homePage)
    const loginCsrf = await getWindowCsrf(loginPage)
    expect(typeof homeCsrf).toEqual('string')
    expect(homeCsrf).toEqual(loginCsrf)
  })

  test('login page has the same token on `window.csrf` as in the login form', async () => {
    const loginWindowCsrf = await getWindowCsrf(loginPage)
    const loginFormCsrf = await loginPage.evaluate(() => {
      const csrfInput = document.getElementsByName(
        'csrf'
      )[0] as HTMLInputElement
      return csrfInput.value
    })
    expect(typeof loginWindowCsrf).toEqual('string')
    expect(loginWindowCsrf).toEqual(loginFormCsrf)
  })
})

async function getWindowCsrf(page: Page): Promise<string> {
  return await page.evaluate(() => {
    return (window as Window & { csrf: string }).csrf
  })
}
