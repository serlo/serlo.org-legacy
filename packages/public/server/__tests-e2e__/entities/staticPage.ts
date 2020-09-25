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
  goto,
  getBySelector,
  login,
  getByText,
  click,
  clear,
} from '../_utils'

test('can not be edited by normal author', async () => {
  await login('login')
  const staticPage = await goto('/math')
  const queryResults = await staticPage.$$('a.btn.btn-success')
  expect(queryResults.length).toBeLessThan(1)
})

test('edit static page', async () => {
  await login('admin')
  const staticPage = await goto('/page/revision/create-old/23591/32995')
  await getByText(staticPage, 'x').then(click)

  //Wait for sideloading animation
  await page.waitFor(600)

  await getBySelector(staticPage, '.CodeMirror-code pre')
    .then(clear)
    .then((e) => e.type('Test content'))

  await page.waitFor(100)

  await getBySelector(staticPage, '.preview-input')
    .then(clear)
    .then((e) => e.type('Test headline'))

  await getBySelector(staticPage, '.preview-checkbox').then(click)
  const editedPage = await getBySelector(
    staticPage,
    '.helper.btn.btn-success.btn-labeled'
  ).then(clickForNewPage)

  expect(await getByText(editedPage, 'Test headline')).toBeDefined()
  expect(await getByText(editedPage, 'Test content')).toBeDefined()
})
