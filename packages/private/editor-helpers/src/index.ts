/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as base64 from 'base-64'
import $ from 'jquery'
import * as utf8 from 'utf8'

export const parseState = (raw: string): unknown => {
  const stringifiedState = utf8.decode(base64.decode(raw))

  if (typeof stringifiedState === 'string') {
    return JSON.parse(stringifiedState)
  }

  return stringifiedState
}

export const stringifyState = (state: unknown): string => {
  return base64.encode(utf8.encode(JSON.stringify(state)))
}

export const getStateFromElement = (element: HTMLElement) => {
  return parseState($(element).data('rawContent'))
}
