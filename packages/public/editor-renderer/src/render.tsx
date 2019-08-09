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
import { render as coreRender } from '@edtr-io/renderer-ssr'
import { plugins } from '@serlo/edtr-io'
import { stringifyState } from '@serlo/editor-helpers'
import {
  convert,
  isEdtr,
  Edtr,
  Legacy,
  Splish
} from '@serlo/legacy-editor-to-editor'
import * as React from 'react'

export async function render(input: string): Promise<string> {
  if (input === undefined) throw new Error('No input given')
  if (input === '') return ''

  let data: Legacy | Splish | Edtr
  try {
    data = JSON.parse(input.trim().replace(/&quot;/g, '"'))
  } catch (e) {
    throw new Error('No valid json string given')
  }

  const state = isEdtr(data) ? data : convert(data)
  // try {
    return wrapOutput(coreRender({ plugins, state }))
  // } catch (e) {
  //   return wrapOutput()
  // }

  function wrapOutput(
    { styles, html }: ReturnType<typeof coreRender> = { styles: '', html: '' }
  ): string {
    return `${styles}<div class="edtr-io" data-edit-type="edtr-io" data-raw-content='${stringifyState(
      state
    )}'>${html}</div>`
  }
}
