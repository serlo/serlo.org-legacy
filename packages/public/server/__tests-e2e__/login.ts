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
  getByText,
  goto,
  click,
} from './_utils'
import { ElementHandle } from 'puppeteer'

beforeAll(async () => {
  await page.setViewport(viewports.desktop)
})

test('correct password and correct user', async () => {
  const firstPage = await goto('/math')

  const loginPage = await elements
    .getLoginButton(firstPage)
    .then(clickForNewPage)

  expect(loginPage).toHaveUrlPath(pages.login.path)

  const afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
    password: '123456',
    page: loginPage,
    user: 'login',
  })

  await expect(await elements.getLogoutButton(afterLoginPage)).toBeDefined()

  const userPage = await elements
    .getProfileButton(afterLoginPage)
    .then(clickForNewPage)

  expect(userPage).toHaveUrlPath('/user/me')
  await expect(userPage).toMatchElement('h1', { text: 'login' })
})

describe('wrong login-data', () => {
  let loginPage: ElementHandle
  beforeEach(async () => (loginPage = await goto('/auth/login')))

  test('wrong password and correct user', async () => {
    const afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
      password: '123',
      page: loginPage,
      user: 'login',
    })
    expect(afterLoginPage).toHaveUrlPath(pages.login.path)

    expect(
      await getByText(
        afterLoginPage,
        'Mit dieser Kombination ist bei uns kein Benutzer registriert.'
      )
    ).toBeDefined
  })

  test('correct password and wrong user', async () => {
    const afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
      password: '123456',
      page: loginPage,
      user: 'abc',
    })

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
    loginPage = await goto('/auth/login')
  })

  test('missing password and missing user', async () => {
    await typeIntoLoginFormAndClickLoginButton({
      password: '',
      page: loginPage,
      user: '',
    })
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })

  test('missing password and correct user', async () => {
    await typeIntoLoginFormAndClickLoginButton({
      password: '',
      page: loginPage,
      user: 'login',
    })
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })

  test('correct password and missing user', async () => {
    await typeIntoLoginFormAndClickLoginButton({
      password: '123456',
      page: loginPage,
      user: '',
    })
    expect(page.url()).toBe(testingServerUrl + pages.login.path)
  })
})

async function typeIntoLoginFormAndClickLoginButton(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  {
    await typeIntoLoginForm(arg)
    const logbutton = elements.getLoginButton(arg.page)
    ;(await logbutton).click
    //await elements.getLoginButton(arg.page).then(click)
  }
}

async function typeIntoLoginFormAndWaitForNewPage(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  {
    await typeIntoLoginForm(arg)
    const { buttonLogin } = pages.login.identifier
    return getByText(arg.page, 'Login').then(clickForNewPage)
  }
}
async function typeIntoLoginForm(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  const { inputUser, inputPassword } = pages.login.identifier
  await getByPlaceholderText(arg.page, inputUser).then((e) => e.type(arg.user))
  await getByPlaceholderText(arg.page, inputPassword).then((e) =>
    e.type(arg.password)
  )
}
