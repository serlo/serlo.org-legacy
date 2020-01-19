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
import { getByPlaceholderText, getByText, getDocument, goto } from './_utils'

const examplePages = [
  '/',
  '/mathe',
  '/mathe/beispielinhalte',
  '/mathe/beispielinhalte/beispielveranstaltung'
]

const user = 'admin'
const selector = '#serlo-menu a'

describe('login process', () => {
  test.each(examplePages)('start page is %p', async startPage => {
    await page.setViewport(viewports.desktop)
    const firstPage = await goto(startPage)

    expect(page).toBePage(startPage)

    await expect(firstPage).toClick(selector, { text: navigation.login })
    await page.waitForNavigation()

    const loginPage = await getDocument(page)
    expect(page).toBePage(login.route)

    const { buttonLogin, inputUser, inputPassword } = login.identifier
    await getByPlaceholderText(loginPage, inputUser).then(e => e.type(user))
    await getByPlaceholderText(loginPage, inputPassword).then(e =>
      e.type(login.defaultPassword)
    )

    await getByText(loginPage, buttonLogin).then(e => e.click())
    await page.waitForNavigation()

    await expect(page).toMatchElement(selector, { text: navigation.logout })
    await expect(page).toClick('.fa.fa-user')
    await page.waitForNavigation()

    expect(page).toBePage('/user/me')
    await expect(page).toMatchElement('h1', { text: user })

    await goto(startPage)
    await expect(page).toClick(selector, { text: navigation.logout })
    await page.waitForNavigation()

    expect(page).toBePage(startPage)
    await expect(page).toMatchElement(selector, { text: navigation.login })
  })
})
