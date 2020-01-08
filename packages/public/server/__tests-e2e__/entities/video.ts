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
import { getByText, getDocument } from '../_utils'

const videoUrl = 'http://de.serlo.localhost:4567/32321'
const videoSelector = '[itemtype="http://schema.org/VideoObject"]'
const titleSelector = videoSelector + ' [itemprop=name]'
const descriptionSelector = videoSelector + ' [itemprop~=description] p'

test('Test elements on video page', async () => {
  await page.goto(videoUrl)
  const $document = await getDocument(page)

  await getByText($document, 'Schriftliche Addition', {
    selector: titleSelector
  })
  await getByText(
    $document,
    'Dieses Video erklärt die Schriftliche Addition mit Hilfe einer Stellenwerttafel.',
    { selector: descriptionSelector }
  )
})

test.each(['contentOnly', 'hideBanner', 'fullWidth'])(
  `Test elements when %p is set (page for content-api)`,
  async contentApiParam => {
    await page.goto(videoUrl + '?' + contentApiParam)

    expect(await page.$(titleSelector)).toBeNull()
    expect(await page.$(descriptionSelector)).toBeNull()
  }
)
