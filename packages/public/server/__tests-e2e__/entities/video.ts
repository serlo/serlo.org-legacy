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
  getByItemType,
  goto,
  getBySelector,
  login,
  randomText,
  getByPlaceholderText,
  saveRevision,
  addContent,
  openDropdownMenu,
} from '../_utils'
import { exampleApiParameters, pages, notifications } from '../_config'

const videoItemType = 'http://schema.org/VideoObject'

describe('view video page', () => {
  const videoPath = '/math/example-content/example-topic-1/example-video'
  const videoTitle = 'Example video'
  const videoDescription = 'This is an example video.'
  const youtubeUrl =
    'https://www.youtube-nocookie.com/embed/2OjVWmAr5gE?html5=1'

  test('view example video page', async () => {
    const videoPage = await goto(videoPath)
    const video = await getByItemType(videoPage, videoItemType)

    await expect(video).toMatchElement('h1', { text: videoTitle })
    await expect(video).toMatchElement('*', { text: videoDescription })
    await expect(video).toHaveTitle(`${videoTitle} (video)`)

    const iframe = await getBySelector(video, 'iframe')
    await expect(iframe).toHaveAttribute('src', youtubeUrl)
  })

  test.each(exampleApiParameters)(
    `view example video page when %p is set (content-api)`,
    async (contentApiParam) => {
      const videoPage = await goto(videoPath + '?' + contentApiParam)
      const video = await getByItemType(videoPage, videoItemType)

      await expect(video).not.toMatchElement('h1', { text: videoTitle })
      await expect(video).not.toMatchElement('*', { text: videoDescription })
      await expect(video).toHaveTitle(`${videoTitle} (video)`)

      const iframe = await getBySelector(video, 'iframe')
      await expect(iframe).toHaveAttribute('src', youtubeUrl)
    }
  )
})

describe('create video page', () => {
  test.each(['admin', 'english_langhelper'])('user is %p', async (user) => {
    const title = randomText('video')
    const description = randomText()
    const youtubeId = '2OjVWmAr5gE'

    await login(user)
    const topic = await goto(pages.e2eTopic.path)
    const createPage = await openDropdownMenu(topic).then(addContent('video'))

    await getByPlaceholderText(createPage, 'Title').then((e) => e.type(title))

    const videoUrlField = await getBySelector(
      createPage,
      '#editor article section:nth-child(1)'
    )
    await videoUrlField.click()
    await videoUrlField.type(`https://www.youtube.com/watch?v=${youtubeId}`)

    const descriptionField = await getBySelector(
      createPage,
      '#editor article section:nth-child(2)'
    )
    await descriptionField.click()
    await descriptionField.click()
    await descriptionField.type(description)

    const success = await saveRevision(createPage)
    await expect(success).toHaveSystemNotification(
      notifications.savedAndCheckedOut
    )

    await expect(success).toMatchElement('h1', { text: title })
    await expect(success).toMatchElement('*', { text: description })
    await expect(success).toHaveTitle(`${title} (video)`)

    const iframe = await getBySelector(success, 'iframe')
    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?html5=1`
    await expect(iframe).toHaveAttribute('src', embedUrl)
  })
})
