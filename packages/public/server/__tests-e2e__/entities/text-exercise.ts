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
import {
  click,
  clickForNewPage,
  getByRole,
  getByLabelText,
  getByText,
  goto,
  getBySelector,
  login,
  logout,
  randomText
} from '../_utils'
import { pages, navigation } from '../_config'

afterEach(async () => {
  await logout()
})

describe('create text-exercise', () => {
  test.each(['admin', 'english_langhelper'])('user is %p', async user => {
    const exercise = randomText('exercise content')
    const hint = randomText('hint')
    const solution = randomText('solution')

    await login(user)
    const topic = await goto(pages.e2eTopic.path)

    await getBySelector(topic, navigation.dropdownToggle).then(click)
    await page.waitForSelector('#subject-nav-wrapper .dropdown-menu')
    await getByText(topic, navigation.addContent).then(e => e.hover())
    const createPage = await getByText(topic, 'text-exercise').then(
      clickForNewPage
    )

    await getByRole(createPage, 'textbox').then(e => e.type(exercise))

    await getByText(createPage, 'Hinweis hinzufügen').then(click)
    await page.waitFor(100)
    await getByRole(createPage, 'textbox').then(t => t.type(hint))

    await getByText(createPage, 'Lösung hinzufügen').then(click)
    await page.waitFor(100)
    await getByRole(createPage, 'textbox').then(t => t.type(solution))

    await getBySelector(createPage, navigation.saveButton).then(click)
    await getByLabelText(createPage, 'Änderungen').then(e =>
      e.type(randomText())
    )
    await createPage.$$('input[type=checkbox]').then(c => c[0].click())
    await createPage.$$('input[type=checkbox]').then(c => c[3].click())

    const success = await getByText(createPage, 'Speichern', {
      selector: 'button'
    }).then(clickForNewPage)

    expect(success).toMatchElement('p', {
      text: 'Your revision has been saved and is available'
    })
    await expect(success).toHaveTitle('Math text-exercise')

    await expect(success).toMatchElement('*', { text: exercise })
    await expect(success).toMatchElement('*', { text: hint })
    await expect(success).toMatchElement('*', { text: solution })
  })
})
