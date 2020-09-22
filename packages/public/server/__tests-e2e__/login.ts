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
import { pages, viewports, elements, testingServerUrl } from './_config'
import {
  clickForNewPage,
  getByPlaceholderText,
  getBySelector,
  getByText,
  getByRole,
  goto,
} from './_utils'
import { ElementHandle } from 'puppeteer'

test('correct password and correct user', async () => {
  await page.setViewport(viewports.desktop)
  const firstPage = await goto('/math')

  const loginPage = await elements
    .getLoginButton(firstPage)
    .then(clickForNewPage)

  expect(loginPage).toHaveUrlPath(pages.login.path)

  const { buttonLogin, inputUser, inputPassword } = pages.login.identifier
  await typeIntoLoginForm('123456', loginPage, 'login')

  const afterLoginPage = await getByText(loginPage, buttonLogin).then(
    clickForNewPage
  )

  await expect(await elements.getLogoutButton(afterLoginPage)).toBeDefined()

  const userPage = await elements
    .getProfileButton(afterLoginPage)
    .then(clickForNewPage)

  expect(userPage).toHaveUrlPath('/user/me')
  await expect(userPage).toMatchElement('h1', { text: 'login' })
})

describe('wrong login-data', () => {
  const { buttonLogin, inputUser, inputPassword } = pages.login.identifier
  let loginPage: ElementHandle

  beforeEach(async () => {
    await page.setViewport(viewports.desktop)
    loginPage = await goto('/auth/login')
  })

  test('wrong password and correct user', async () => {
    await typeIntoLoginForm('123', loginPage, 'login')

    const afterLoginPage = await getByText(loginPage, buttonLogin).then(
      clickForNewPage
    )

    expect(afterLoginPage).toHaveUrlPath(pages.login.path)

    expect(
      await getByText(
        afterLoginPage,
        'Mit dieser Kombination ist bei uns kein Benutzer registriert.'
      )
    ).toBeDefined
  })

  test('correct password and wrong user', async () => {
    await typeIntoLoginForm('123456', loginPage, 'abc')
    const afterLoginPage = await getByText(loginPage, buttonLogin).then(
      clickForNewPage
    )
    expect(afterLoginPage).toHaveUrlPath(pages.login.path)

    expect(
      await getByText(
        afterLoginPage,
        'Mit dieser Kombination ist bei uns kein Benutzer registriert.'
      )
    ).toBeDefined
  })
})

describe('missing login-data', () => {
  let loginPage: ElementHandle

  beforeAll(async () => {
    await page.setViewport(viewports.desktop)
    loginPage = await goto('/auth/login')
  })
  test('missing password and missing user', async () => {
    typeIntoLoginForm('', loginPage, '')
    clickOnLoginButton(loginPage)
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })

  test('missing password and correct user', async () => {
    typeIntoLoginForm('', loginPage, 'login')
    clickOnLoginButton(loginPage)
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })

  test('correct password and missing user', async () => {
    typeIntoLoginForm('123456', loginPage, '')
    clickOnLoginButton(loginPage)
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })
})

async function typeIntoLoginForm(
  password: string,
  page: ElementHandle,
  user: string
) {
  const { inputUser, inputPassword } = pages.login.identifier
  await getByPlaceholderText(page, inputUser).then((e) => e.type(user))
  await getByPlaceholderText(page, inputPassword).then((e) => e.type(password))
}
async function clickOnLoginButton(page: ElementHandle) {
  const { buttonLogin } = pages.login.identifier
  await getByText(page, buttonLogin).then(clickForNewPage)
}
