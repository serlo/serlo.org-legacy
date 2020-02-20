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
import { AddButton, styled } from '@edtr-io/editor-ui'
import {
  EditorPlugin,
  EditorPluginProps,
  child,
  object,
  optional
} from '@edtr-io/plugin'
import * as React from 'react'

const exerciseState = object({
  content: child({ plugin: 'rows' }),
  interactive: optional(
    child<'scMcExercise' | 'inputExercise'>({ plugin: 'scMcExercise' })
  )
})

export type ExerciseState = typeof exerciseState
export type ExerciseProps = EditorPluginProps<ExerciseState>

export const exercisePlugin: EditorPlugin<ExerciseState> = {
  Component: ExerciseEditor,
  state: exerciseState,
  config: {}
}

const ButtonContainer = styled.div({
  display: 'flex'
})

function ExerciseEditor({ editable, state, focused }: ExerciseProps) {
  const { content, interactive } = state

  return (
    <React.Fragment>
      {content.render()}
      {renderInteractive()}
    </React.Fragment>
  )

  function renderInteractive() {
    if (interactive.defined) {
      return interactive.render()
    }

    if (editable) {
      return (
        <ButtonContainer>
          <AddButton
            onClick={() => {
              // @ts-ignore
              interactive.create({
                plugin: 'scMcExercise'
              })
            }}
          >
            Auswahlaufgabe hinzufügen
          </AddButton>
          <AddButton
            onClick={() => {
              // @ts-ignore
              interactive.create({
                plugin: 'inputExercise'
              })
            }}
          >
            Eingabefeld hinzufügen
          </AddButton>
        </ButtonContainer>
      )
    }

    return null
  }
}
