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
import { login, navigation, viewports } from './_config'
import {
  clickForNewPage,
  getByPlaceholderText,
  getBySelector,
  getByText,
  getDocument,
  goto
} from './_utils'

const examplePages = [
  '/',
  '/mathe',
  '/mathe/beispielinhalte',
  '/mathe/beispielinhalte/beispielveranstaltung'
]

const user = 'admin'
const selector = '#serlo-menu a'

describe('login process', () => {
  test.each(examplePages)('start page is %p', async startPath => {
    await page.setViewport(viewports.desktop)
    const firstPage = await goto(startPath)

    expect(firstPage).toHaveUrlPath(startPath)

    const loginPage = await getByText(firstPage, navigation.login, {
      selector
    }).then(clickForNewPage)

    expect(loginPage).toHaveUrlPath(login.path)

    const { buttonLogin, inputUser, inputPassword } = login.identifier
    await getByPlaceholderText(loginPage, inputUser).then(e => e.type(user))
    await getByPlaceholderText(loginPage, inputPassword).then(e =>
      e.type(login.defaultPassword)
    )

    const afterLoginPage = await getByText(loginPage, buttonLogin).then(
      clickForNewPage
    )

    await expect(afterLoginPage).toMatchElement(selector, {
      text: navigation.logout
    })

    const userPage = await getBySelector(
      afterLoginPage,
      selector + ' .fa.fa-user'
    ).then(clickForNewPage)

    expect(userPage).toHaveUrlPath('/user/me')
    await expect(userPage).toMatchElement('h1', { text: user })

    const pageForCallLogout = await goto(startPath)
    const afterLogoutPage = await getByText(
      pageForCallLogout,
      navigation.logout,
      { selector }
    ).then(clickForNewPage)

    expect(afterLogoutPage).toHaveUrlPath(startPath)
    await expect(afterLogoutPage).toMatchElement(selector, {
      text: navigation.login
    })
  })
})
