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
  getByText,
  getAllByText,
  getByLabelText,
  getByPlaceholderText,
  saveRevision,
  addContent,
  openDropdownMenu,
  click,
  getByAltText,
} from '../_utils'
import { pages, viewports, elements, testingServerUrl } from '../_config'
import { ElementHandle } from 'puppeteer'

beforeAll(async () => {
  await page.setViewport(viewports.desktop)
})
/*
test('static page can be edited by admin', async () => {
  await login('admin')
  const staticPage = await goto('/math')
  expect(await getEditStaticPageButton(staticPage)).toBeDefined()
})

test('can not be edited by normal author', async () => {
  await login('login')
  const staticPage = await goto('/math')
  const queryResults = await staticPage.$$('a.btn.btn-success')
  expect(queryResults.length).toBeLessThan(1)
})*/

test('edit static page', async () => {
  await login('admin')
  const staticPage = await goto('/page/revision/create-old/23591/32995')
  await getByText(staticPage, 'x').then(click)

  //await getByText(staticPage, 'Mathematics home page')
  await getBySelector(staticPage, '.preview-input').then((e) =>
    e.type(' Some headline')
  )
  await getByLabelText(staticPage, 'Title:', { selector: 'preview-input' })
  // expect(await getByText(staticPage, 'Mathematics home page Some headline'))
  //  .toBeDefined
})

async function getEditStaticPageButton(page: ElementHandle) {
  return getBySelector(page, 'a.btn.btn-success')
}
