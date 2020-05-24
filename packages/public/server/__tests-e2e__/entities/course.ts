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
  getByPlaceholderText,
  getBySelector,
  getByText,
  getByRole,
  goto,
  login,
  randomText,
  getByItemType,
  saveRevision,
  addContent,
  openDropdownMenu,
  typeIntoEditor,
} from '../_utils'
import { notifications, pages, viewports } from '../_config'

const courseItemType = 'http://schema.org/Article'

test('view course', async () => {
  const path = '/math/example-content/example-topic-1/example-course'
  const title = 'Example Course | Example Course Page 1 (course)'
  const heading = 'Example Course Page 1'
  const content = 'This is example course Page 1'
  const page2Title = 'Example Course Page 2'

  const coursePage = await goto(path)
  await expect(coursePage).toHaveTitle(title)

  const course = await getByItemType(coursePage, courseItemType)
  await expect(course).toMatchElement('h1', { text: heading })

  await expect(course).toMatchElement('*', { text: content })
  await expect(course).toMatchElement('a', { text: page2Title })
})

test('create course with course page', async () => {
  await page.setViewport(viewports.desktop)
  const user = 'admin'

  const title = randomText('course')
  const coursePageTitle = randomText('course-page')
  const coursePageContent = randomText()

  await login(user)
  const topic = await goto(pages.e2eTopic.path)
  const createPage = await openDropdownMenu(topic).then(addContent('course'))

  await getByPlaceholderText(createPage, 'Title').then(e => e.type(title))

  await getByText(createPage, 'Add course page').then(click)

  const coursePage = await getBySelector(createPage, '#editor article article')
  await getByPlaceholderText(coursePage, 'Title').then(e =>
    e.type(coursePageTitle)
  )

  await typeIntoEditor(coursePage, 0, coursePageContent)

  const success = await saveRevision(createPage)
  await expect(success).toHaveSystemNotification(
    notifications.savedAndCheckedOut
  )

  await expect(success).toMatchElement('h1', { text: coursePageTitle })
  await expect(success).toMatchElement('*', { text: coursePageContent })
  await expect(success).toHaveTitle(`${title} | ${coursePageTitle} (course)`)
})
