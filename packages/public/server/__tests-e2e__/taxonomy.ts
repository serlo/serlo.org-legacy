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
import { pages, elements } from './_config'
import {
  goto,
  getText,
  getMainContent,
  getByItemProp,
  getBySelector,
  getByText,
  getByPlaceholderText,
  click,
  clickForNewPage,
  login,
  logout,
  randomText
} from './_utils'

afterEach(async () => {
  await logout()
})

test('view topic page with subtopics', async () => {
  const topic = await goto('/math/example-content').then(getMainContent)

  await expect(topic).toMatchElement('h1', {
    text: 'Example content'
  })

  await expect(
    topic.$$('h2').then(h => Promise.all(h.map(getText)))
  ).resolves.toEqual(['Example topic 1', 'Example topic 2', 'Example topic 3'])

  await expect(topic).toMatchElement('a', {
    text: 'Example article'
  })
  await expect(topic).toMatchElement('a', {
    text: 'Example topic folder'
  })
  await expect(topic).toHaveTitle('Example content (topic)')
})

test('view topic page with entites and topic folders', async () => {
  const topicPath = '/math/example-content/example-topic-1'
  const topic = await goto(topicPath).then(getMainContent)

  await expect(topic).toMatchElement('h1', { text: 'Example topic 1' })
  await expect(topic).toMatchElement('div.h2', { text: 'Articles' })
  await expect(topic).toMatchElement('h2', { text: 'Exercises' })
  await expect(topic).toMatchElement('a', { text: 'Example article' })
  await expect(topic).toMatchElement('a', {
    text: 'Example topic folder'
  })
  await expect(topic).toHaveTitle('Example topic 1 (topic)')
})

test('navigating through the taxonomy', async () => {
  const rootTopic = await goto('/math/example-content').then(getMainContent)

  const topic1 = await getByText(rootTopic, 'Example topic 1').then(
    clickForNewPage
  )

  expect(topic1).toHaveUrlPath('/math/example-content/example-topic-1')
  await expect(topic1).toMatchElement('h1', { text: 'Example topic 1' })

  const article = await getByText(topic1, 'Example article').then(
    clickForNewPage
  )

  expect(article).toHaveUrlPath(
    '/math/example-content/example-topic-1/example-article'
  )
  await expect(article).toMatchElement('h1', { text: 'Example article' })
})

describe('Creating taxonomy element', () => {
  describe.each(['admin', 'english_langhelper'])('user is %p', user => {
    test.each(['topic', 'topic-folder'])(
      'taxonomy type is %p',
      async taxonomyType => {
        const title = randomText('Test ' + taxonomyType)
        const description = randomText()

        await login(user)
        let rootTopic = await goto(pages.e2eTopic.path)

        await elements.getDropdownToggle(rootTopic).then(click)
        const organizeRoot = await getByText(
          rootTopic,
          'Organize taxonomy'
        ).then(clickForNewPage)

        await getBySelector(
          organizeRoot,
          '#content-layout > .pull-right .dropdown-toggle'
        ).then(click)
        const createPage = await getByText(organizeRoot, taxonomyType, {
          selector: '#content-layout > .pull-right a'
        }).then(clickForNewPage)

        await getByPlaceholderText(createPage, 'Titel').then(e => e.type(title))
        await getByItemProp(createPage, 'articleBody').then(click)
        await getByItemProp(createPage, 'articleBody').then(e =>
          e.type(description)
        )
        const success = await elements
          .getSaveButton(createPage)
          .then(clickForNewPage)

        await expect(success).toMatchElement('p', {
          text: 'The node has been added successfully!'
        })

        rootTopic = await getBySelector(
          success,
          '.page-header .fa-chevron-left'
        ).then(clickForNewPage)

        if (taxonomyType == 'topic') {
          await expect(rootTopic).toMatchElement('h2', { text: title })
          await expect(rootTopic).toMatchElement('*', { text: description })
        } else {
          await expect(rootTopic).toMatchElement('a', { text: title })
          await expect(rootTopic).not.toMatchElement('*', { text: description })
        }

        const newTopic = await getByText(rootTopic, title).then(clickForNewPage)

        await expect(newTopic).toMatchElement('h1', { text: title })
        await expect(newTopic).toMatchElement('*', { text: description })

        await expect(newTopic).toHaveTitle(
          taxonomyType == 'topic' ? `${title} (${taxonomyType})` : title
        )
      }
    )
  })
})
