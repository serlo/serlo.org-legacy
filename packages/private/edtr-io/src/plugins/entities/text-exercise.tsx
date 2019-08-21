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
  ScopeContext,
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import {
  editorContent,
  standardElements,
  SaveButton,
  serializedChild
} from './common'

export const textExerciseState = StateType.object({
  ...standardElements,
  content: editorContent(),
  'text-solution': serializedChild('textSolution')
})

export const textExercisePlugin: StatefulPlugin<typeof textExerciseState> = {
  Component: TextExerciseRenderer,
  state: textExerciseState
}

function TextExerciseRenderer(
  props: StatefulPluginEditorProps<typeof textExerciseState>
) {
  const { content, 'text-solution': textSolution, license } = props.state

  const { scope } = React.useContext(ScopeContext)
  return (
    <div>
      {content.render()}
      <div>{textSolution.render()}</div>
      <div>
        <img src={license.iconHref.value} />
        {license.title.value}
      </div>
      <SaveButton scope={scope} />
    </div>
  )
}
