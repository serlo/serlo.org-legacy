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
import { selectors, useStore } from '@edtr-io/core'
import * as React from 'react'

export function useLogState(scope?: string) {
  const store = useStore(scope)
  return () => {
    const serialized = selectors.serializeRootDocument(store.getState())
    const stringified = JSON.stringify({
      state: JSON.stringify(serialized)
    })
    // eslint-disable-next-line no-console
    console.log(stringified.substr(9, stringified.length - 9 - 1))
  }
}

export function useEditable(initial?: boolean) {
  return React.useState(initial === undefined ? true : initial)
}

export { useEditorHistory } from '@edtr-io/core'
