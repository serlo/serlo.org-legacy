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
import { serializer, slateValueToHtml } from '@edtr-io/plugin-text/internal'
import * as R from 'ramda'
import { Value } from 'slate'

import { Edtr } from '../legacy/legacy-editor-to-editor/splishToEdtr/types'

export function cleanEdtrState(state: Edtr) {
  return cleanJson(state)

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function cleanJson(jsonObj: any): any {
    if (jsonObj !== null && typeof jsonObj === 'object') {
      return R.map((value: any) => {
        if (value.plugin === 'text' && value.state) {
          const slateValue = Value.fromJSON(serializer.deserialize(value.state))
          return {
            ...value,
            state: slateValueToHtml(slateValue)
          }
        }
        return cleanJson(value)
      }, jsonObj)
    } else {
      // jsonObj is a number or string
      return jsonObj
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
