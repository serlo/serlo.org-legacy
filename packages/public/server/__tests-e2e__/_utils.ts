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
import * as assert from 'assert'
import { ElementHandle } from 'puppeteer'
import { queries } from 'pptr-testing-library'

export { getDocument } from 'pptr-testing-library'

export function getByText(
  element: ElementHandle,
  text: string,
  selector?: string
): Promise<ElementHandle> {
  return queries.getByText(element, text, { selector })
}

export function getBySelector(
  element: ElementHandle,
  selector: string
): Promise<ElementHandle> {
  return element.$$(selector).then(queryResults => {
    assert.ok(
      queryResults.length > 0,
      `No element for selector \`${selector}\` found`
    )
    assert.ok(
      queryResults.length < 2,
      `More than one element for selector \`${selector}\` found`
    )

    return queryResults[0]
  })
}

export function getInnerHTML(element: ElementHandle): Promise<string> {
  return element.evaluate(e => e.innerHTML)
}
