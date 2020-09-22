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
  clickForNewPage,
  getByItemType,
  getByItemProp,
  goto,
  getBySelector,
  login,
  randomText,
  getByPlaceholderText,
  saveRevision,
  addContent,
  openDropdownMenu,
} from '../_utils'
import { pages, notifications, elements } from '../_config'

//What schema?
const articleItemType = 'http://schema.org/Article'

test('view static page', async () => {
  const path = '/serlo'
  const title = 'That page does'
  const content = 'komplett kostenlose Website'

  const staticPage = await goto(path)
  await expect(staticPage).toHaveTitle(title)

  const article = await getByItemType(staticPage, articleItemType)
  await expect(article).toMatchElement('h1', { text: title })

  await expect(article).toMatchElement('*', { text: content })
})

test('create static page', async () => {
  const title = randomText('titel of static page')
  const content = randomText()
  const user = 'admin'

  await login(user)
  const topic = await goto(pages.e2eTopic.path)
  const createPage = await openDropdownMenu(topic).then(addContent('article'))

  await getByPlaceholderText(createPage, 'Title').then((e) => e.type(title))

  const contentField = await getByItemProp(createPage, 'articleBody')
  await contentField.click()
  await contentField.type(content)

  const success = await saveRevision(createPage)
  await expect(success).toHaveSystemNotification(
    notifications.savedAndCheckedOut
  )

  await expect(success).toHaveTitle(title)

  await expect(success).toMatchElement('h1', { text: title })
  await expect(success).toMatchElement('*', { text: content })
})
