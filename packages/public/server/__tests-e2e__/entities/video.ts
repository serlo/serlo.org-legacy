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
import * as R from 'ramda'

describe('videos', () => {
  const videoEntityUrl = 'http://de.serlo.localhost:4567/32321'

  test.each(['#title', '#description'])(
    'video page has element %p',
    async elementId => {
      await page.goto(videoEntityUrl)
      expect(await page.$(elementId)).not.toBeNull()
    }
  )

  test.each(
    R.xprod(
      ['#title', '#description'],
      ['contentOnly', 'hideBanner', 'fullWidth']
    )
  )(
    'video page has no element %p when %p is set (page for content-api)',
    async (elementId, contentApiParam) => {
      await page.goto(videoEntityUrl + '?' + contentApiParam)
      expect(await page.$(elementId)).toBeNull()
    }
  )
})
