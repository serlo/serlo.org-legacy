// /**
//  * This file is part of Serlo.org.
//  *
//  * Copyright (c) 2013-2019 Serlo Education e.V.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License")
//  * you may not use this file except in compliance with the License
//  * You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
//  * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
//  * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
//  */
// import { Browser, launch, Page } from 'puppeteer'
// import { element } from 'prop-types'
//
// describe('videos', () => {
//   let browser: Browser
//   let page: Page
//
//   const pageHeaderSelector = '.page-header'
//   const history = 'http://de.serlo.localhost:4567/entity/repository/history/1855'
//
//   beforeAll(async () => {
//     browser = await launch()
//   })
//
//   beforeEach(async () => {
//     page = await browser.newPage()
//   })
//
//   afterEach(async () => {
//     await page.close()
//   })
//
//   afterAll(async () => {
//     await browser.close()
//   })
//
//   test('history links to new editor only', async () => {
//     await page.goto(history)
//     expect(await page.$eval('td a', a => a.getAttribute('href'))).toEqual('foo')
//   })
// })
