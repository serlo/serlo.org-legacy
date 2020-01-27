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
import { getByItemType, goto, getBySelector } from '../_utils'
import { exampleApiParameters } from '../_config'

const videoPath = '/35567'
const videoItemType = 'http://schema.org/VideoObject'
const videoTitle = 'Example video'
const videoDescription = 'This is an example video.'
const youtubeUrl = 'https://www.youtube-nocookie.com/embed/2OjVWmAr5gE?html5=1'

test('Test elements on video page', async () => {
  const videoPage = await goto(videoPath)
  const video = await getByItemType(videoPage, videoItemType)

  await expect(video).toMatchElement('h1', { text: videoTitle })
  await expect(video).toMatchElement('*', { text: videoDescription })
  await expect(video).toHaveTitle(`${videoTitle} (video)`)

  const iframe = await getBySelector(video, 'iframe')
  await expect(iframe).toHaveAttribute('src', youtubeUrl)
})

test.each(exampleApiParameters)(
  `Test elements when %p is set (page for content-api)`,
  async contentApiParam => {
    const videoPage = await goto(videoPath + '?' + contentApiParam)
    const video = await getByItemType(videoPage, videoItemType)

    await expect(video).not.toMatchElement('h1', { text: videoTitle })
    await expect(video).not.toMatchElement('*', { text: videoDescription })
    await expect(video).toHaveTitle(`${videoTitle} (video)`)

    const iframe = await getBySelector(video, 'iframe')
    await expect(iframe).toHaveAttribute('src', youtubeUrl)
  }
)
