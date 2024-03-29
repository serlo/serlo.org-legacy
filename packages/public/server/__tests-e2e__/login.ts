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
import { pages } from './_config'
import {
  clickForNewPage,
  getByPlaceholderText,
  getByText,
  goto,
  click,
  getCurrentPage,
} from './_utils'
import { ElementHandle } from 'puppeteer'

test('correct password and correct user', async () => {
  const loginPage = await goto('/auth/login')
  const afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
    page: loginPage,
    user: 'login',
    password: '123456',
  })
  const userPage = await goto('/user/me')
  await expect(userPage).toMatchElement('h1', { text: 'login' })
})

describe('wrong login-data', () => {
  let loginPage: ElementHandle
  let afterLoginPage: ElementHandle

  beforeEach(async () => (loginPage = await goto('/auth/login')))

  describe('password and user is given', () => {
    test('wrong password and correct user', async () => {
      afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
        password: '123',
        page: loginPage,
        user: 'login',
      })
    })

    test('correct password and wrong user', async () => {
      afterLoginPage = await typeIntoLoginFormAndWaitForNewPage({
        password: '123456',
        page: loginPage,
        user: 'abc',
      })
    })

    afterEach(async () => {
      expect(afterLoginPage).toHaveUrlPath(pages.login.path)
      expect(
        await getByText(
          afterLoginPage,
          'Mit dieser Kombination ist bei uns kein Benutzer registriert.'
        )
      ).toBeDefined()
    })
  })

  describe('user or password is missing', () => {
    test('missing password and missing user', async () => {
      await typeIntoLoginFormAndClickLoginButton({
        page: loginPage,
        user: '',
        password: '',
      })
    })

    test('missing password and correct user', async () => {
      await typeIntoLoginFormAndClickLoginButton({
        page: loginPage,
        user: 'login',
        password: '',
      })
    })

    test('correct password and missing user', async () => {
      await typeIntoLoginFormAndClickLoginButton({
        page: loginPage,
        user: '',
        password: '123456',
      })
    })

    afterEach(async () => {
      expect(await getCurrentPage()).toHaveUrlPath('/auth/login')
    })
  })
})

async function typeIntoLoginForm(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  await getByPlaceholderText(arg.page, 'Email address or Username').then((e) =>
    e.type(arg.user)
  )
  await getByPlaceholderText(arg.page, 'Password').then((e) =>
    e.type(arg.password)
  )
}

async function typeIntoLoginFormAndClickLoginButton(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  await typeIntoLoginForm(arg)

  return getLoginButtonOfLoginForm(arg.page).then(click)
}

async function typeIntoLoginFormAndWaitForNewPage(arg: {
  page: ElementHandle
  user: string
  password: string
}) {
  await typeIntoLoginForm(arg)

  return getLoginButtonOfLoginForm(arg.page).then(clickForNewPage)
}

async function getLoginButtonOfLoginForm(page: ElementHandle) {
  return getByText(page, 'Login')
}
