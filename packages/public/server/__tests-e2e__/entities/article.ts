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
  getByItemType,
  getByItemProp,
  getByLabelText,
  getByText,
  goto,
  getBySelector,
  login,
  logout,
  randomText,
  getByPlaceholderText
} from '../_utils'
import { pages, navigation } from '../_config'

const articleItemType = 'http://schema.org/Article'

test('view article', async () => {
  const path = '/math/example-content/example-topic-1/example-article'
  const title = 'Example article'
  const content = 'Hello World! 42'

  const articlePage = await goto(path)
  await expect(articlePage).toHaveTitle(title)

  const article = await getByItemType(articlePage, articleItemType)
  await expect(article).toMatchElement('h1', { text: title })

  await expect(article).toMatchElement('*', { text: content })
})

test('view article (old editor)', async () => {
  const path =
    '/math/example-content/example-topic-1/example-article-(old-editor)'
  const title = 'Example article (old editor)'
  const content = 'Hello <strong>World</strong>! <em>42</em>'

  const articlePage = await goto(path)
  await expect(articlePage).toHaveTitle(title)

  const article = await getByItemType(articlePage, articleItemType)
  await expect(article).toMatchElement('h1', { text: title })

  const description = await getByItemProp(article, 'articleBody').then(div =>
    getBySelector(div, 'p')
  )
  await expect(description).toHaveHTMLContent(content)
})

describe('create/update articles', () => {
  afterEach(async () => {
    await logout()
  })

  describe('create article', () => {
    test.each(['admin', 'english_langhelper'])('user is %p', async user => {
      const title = randomText('video')
      const content = randomText()

      await login(user)
      const topic = await goto(pages.e2eTopic.path)

      await getBySelector(topic, navigation.dropdownToggle).then(click)
      await page.waitForSelector('#subject-nav-wrapper .dropdown-menu')
      await getByText(topic, navigation.addContent).then(e => e.hover())
      const createPage = await getByText(topic, 'article').then(clickForNewPage)

      await getByPlaceholderText(createPage, 'Titel').then(e => e.type(title))

      const contentField = await getByItemProp(createPage, 'articleBody')
      await contentField.click()
      await contentField.type(content)

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
      await expect(success).toHaveTitle(title)

      await expect(success).toMatchElement('h1', { text: title })
      await expect(success).toMatchElement('*', { text: content })
    })
  })
})
