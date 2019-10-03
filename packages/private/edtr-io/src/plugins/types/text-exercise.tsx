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
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  object
} from '@edtr-io/plugin'
import * as React from 'react'

import {
  editorContent,
  entity,
  Controls,
  optionalSerializedChild,
  OptionalChild
} from './common'
import { AddButton } from '@edtr-io/editor-ui'

export const textExerciseTypeState = object({
  ...entity,
  content: editorContent(),
  'text-hint': optionalSerializedChild('type-text-hint'),
  'text-solution': optionalSerializedChild('type-text-solution')
})

export const textExerciseTypePlugin: StatefulPlugin<
  typeof textExerciseTypeState
> = {
  Component: TextExerciseTypeEditor,
  state: textExerciseTypeState
}

export function TextExerciseTypeEditor(
  props: StatefulPluginEditorProps<typeof textExerciseTypeState> & {
    skipControls?: boolean
  }
) {
  const {
    content,
    'text-hint': textHint,
    'text-solution': textSolution
  } = props.state

  return (
    <article className="text-exercise">
      {content.render()}
      {textHint.id ? (
        <OptionalChild
          state={textHint}
          onRemove={() => {
            textHint.remove()
          }}
        />
      ) : (
        <AddButton
          onClick={() => {
            textHint.create()
          }}
        >
          Hinweis hinzufügen
        </AddButton>
      )}
      {textSolution.id ? (
        <OptionalChild
          state={textSolution}
          onRemove={() => {
            textSolution.remove()
          }}
        />
      ) : (
        <AddButton
          onClick={() => {
            textSolution.create()
          }}
        >
          Lösung hinzufügen
        </AddButton>
      )}
      {props.skipControls ? null : <Controls subscriptions {...props.state} />}
    </article>
  )
}
