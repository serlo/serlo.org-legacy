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
  goto,
  getText,
  getMainContent,
  getByText,
  clickForNewPage
} from './_utils'

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
