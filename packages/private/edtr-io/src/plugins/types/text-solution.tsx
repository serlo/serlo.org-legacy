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
import * as React from 'react'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { editorContent, entity } from '../entities/common'

export const textSolutionTypeState = StateType.object({
  ...entity,
  title: StateType.string(),
  content: editorContent()
})

export const textSolutionTypePlugin: StatefulPlugin<
  typeof textSolutionTypeState
> = {
  Component: TextSolutionTypeEditor,
  state: textSolutionTypeState
}

function TextSolutionTypeEditor(
  props: StatefulPluginEditorProps<typeof textSolutionTypeState>
) {
  return <solutionPlugin.Component {...props} />
}
