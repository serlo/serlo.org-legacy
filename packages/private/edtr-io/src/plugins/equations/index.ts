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
  child,
  list,
  object,
  EditorPlugin,
  EditorPluginProps,
  string,
} from '@edtr-io/plugin'

import { EquationsEditor } from './editor'
import { Sign } from './sign'

const stepProps = object({
  left: child({ plugin: 'text' }),
  sign: string(Sign.Equals),
  right: child({ plugin: 'text' }),
  transform: child({ plugin: 'text' }),
})

const equationsState = object({
  steps: list(stepProps, 1),
})

export type EquationsState = typeof equationsState
export type EquationsProps = EditorPluginProps<EquationsState>

export const equationsPlugin: EditorPlugin<EquationsState> = {
  Component: EquationsEditor,
  config: {},
  state: equationsState,
}
