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

import { goto } from '../_utils'
import { exampleApiParameters } from '../_config'

describe('grouped text exercise', () => {
  const id = '35581'
  const path = '/' + id

  test('grouped exercise has page header', async () => {
    const page = await goto(path)
    await expect(page).toMatchElement('h1', { text: id })
  })

  describe('grouped exercise has no heading on content-api requests', () => {
    test.each(exampleApiParameters)(
      'parameter %p is set',
      async contentApiParam => {
        const page = await goto(`${path}?${contentApiParam}`)
        await expect(page).not.toMatchElement('h1', { text: id })
      }
    )
  })
})
