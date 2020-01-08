/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

describe('videos', () => {
  const pageHeaderSelector = '.page-header'
  const groupedExerciseUrl = 'http://de.serlo.localhost:4567/12727'

  test('grouped exercise has page header', async () => {
    await page.goto(groupedExerciseUrl)
    expect(await page.$$(pageHeaderSelector)).toHaveLength(1)
  })

  test.each(['contentOnly', 'hideBanner', 'fullWidth'])(
    'grouped exercise has no page header when %p is set (content-api)',
    async contentApiParam => {
      await page.goto(groupedExerciseUrl + '?' + contentApiParam)
      expect(await page.$(pageHeaderSelector)).toBeNull()
    }
  )
})
