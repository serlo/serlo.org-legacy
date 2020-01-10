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
import { getByItemType, getByText, getDocument, queryByText } from '../_utils'
import { exampleApiParameters } from '../_config'

const videoUrl = 'http://de.serlo.localhost:4567/32321'
const videoItemType = 'http://schema.org/VideoObject'
const videoTitle = 'Schriftliche Addition'
const videoDescription =
  'Dieses Video erklärt die Schriftliche Addition mit Hilfe einer Stellenwerttafel.'

test('Test elements on video page', async () => {
  const video = await gotoVideo()
  await getByText(video, videoTitle, { selector: 'h1' })
  await getByText(video, videoDescription)
})

test.each(exampleApiParameters)(
  `Test elements when %p is set (page for content-api)`,
  async contentApiParam => {
    const video = await gotoVideo(`?${contentApiParam}`)
    expect(await queryByText(video, videoTitle, { selector: 'h1' })).toBeNull()
    expect(await queryByText(video, videoDescription)).toBeNull()
  }
)

async function gotoVideo(postFix = '') {
  await page.goto(`${videoUrl}${postFix}`)
  const $document = await getDocument(page)
  return await getByItemType($document, videoItemType)
}
