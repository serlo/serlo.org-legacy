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

import { getByText, getDocument, queryByText } from '../_utils'
import { exampleApiParameters } from '../_config'

const groupedTextExerciseUrl = 'http://de.serlo.localhost:4567/12727'

test('grouped exercise has page header', async () => {
  const $document = await gotoGroupedTextExercise()
  await getByText($document, '12727', { selector: 'h1' })
})

test.each(exampleApiParameters)(
  'grouped exercise has no heading when %p is set (content-api)',
  async contentApiParam => {
    const $document = await gotoGroupedTextExercise(`?${contentApiParam}`)
    expect(await queryByText($document, '12727', { selector: 'h1' })).toBeNull()
  }
)

async function gotoGroupedTextExercise(postFix = '') {
  await page.goto(`${groupedTextExerciseUrl}${postFix}`)
  return await getDocument(page)
}
