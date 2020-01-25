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
import { goto, getBySelector, getText } from './_utils'

test('view topic page with subtopics', async () => {
  const topicPage = await goto('/math/example-content')
  const topicPageMainContent = await getBySelector(topicPage, '#page')

  await expect(topicPageMainContent).toMatchElement('h1', {
    text: 'Example content'
  })

  await expect(
    topicPageMainContent.$$('h2').then(h => Promise.all(h.map(getText)))
  ).resolves.toEqual(['Example topic 1', 'Example topic 2', 'Example topic 3'])

  await expect(topicPageMainContent).toMatchElement('a', {
    text: 'Example article'
  })
  await expect(topicPageMainContent).toMatchElement('a', {
    text: 'Example topic folder'
  })
})

test('view topic page with entites and topic folders', async () => {
  const topicPage = await goto('/math/example-content/example-topic-1')
  const mainContent = await getBySelector(topicPage, '#page')

  await expect(mainContent).toMatchElement('h1', { text: 'Example topic 1' })
  await expect(mainContent).toMatchElement('div.h2', { text: 'Articles' })
  await expect(mainContent).toMatchElement('h2', { text: 'Exercises' })
  await expect(mainContent).toMatchElement('a', { text: 'Example article' })
  await expect(mainContent).toMatchElement('a', {
    text: 'Example topic folder'
  })
})
