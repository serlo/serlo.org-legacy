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
import { Editor as Core, StateType } from '@edtr-io/core'
import * as React from 'react'

import { plugins } from './plugins'
import { StateDescriptorSerializedType } from '@edtr-io/core/dist/plugin-state'
import { articleState } from './plugins/entities/article'
import {
  convert,
  Edtr,
  isEdtr,
  Legacy,
  Splish
} from '@serlo/legacy-editor-to-editor'
import { StandardElements } from './plugins/entities/common'
import { textExerciseState } from './plugins/entities/text-exercise'
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import { textSolutionState } from './plugins/entities/text-solution'

export interface EditorProps {
  initialState: unknown
  type: string
}

export function Editor(props: React.PropsWithChildren<EditorProps>) {
  return (
    <Core
      plugins={plugins}
      defaultPlugin="text"
      initialState={convertState(props)}
      editable
    >
      {props.children}
    </Core>
  )
}

function convertState(props: EditorProps) {
  switch (props.type) {
    case 'article':
      return convertArticle(props.initialState as ArticleState)
    case 'text-exercise':
      return convertTextExercise(props.initialState as TextExerciseState)
    default:
      throw new Error('NOOOO!')
  }
}

function convertTextSolution(
  state: TextSolutionState
): Plugin<'textSolution', typeof textSolutionState> {
  return {
    plugin: 'textSolution',
    state: {
      ...state,
      content: toEdtr(state.content)
    }
  }
}

function convertTextExercise({
  content,
  singleChoiceWrongAnswer,
  singleChoiceRightAnswer,
  multipleChoiceWrongAnswer,
  multipleChoiceRightAnswer,
  // inputExpressionEqualMatchChallenge,
  // inputNumberExactMatchChallenge,
  // inputStringNormalizedMatchChallenge,
  ...state
}: TextExerciseState): Plugin<'textExercise', typeof textExerciseState> {
  const scMcExercise = convertScMc()

  const converted = toEdtr(content)
  // const inputExercise = convertInputExercise({ inputExpressionEqualMatchChallenge, inputNumberExactMatchChallenge, inputStringNormalizedMatchChallenge })

  return {
    plugin: 'textExercise',
    state: {
      ...state,
      textSolution: convertTextSolution(state.textSolution),
      content: {
        plugin: 'rows',
        state: [...converted.state, ...(scMcExercise ? [scMcExercise] : [])]
      }
    }
  }

  function convertScMc():
    | {
        plugin: 'scMcExercise'
        state: StateType.StateDescriptorSerializedType<typeof scMcExerciseState>
      }
    | undefined {
    if (
      singleChoiceWrongAnswer ||
      singleChoiceRightAnswer ||
      multipleChoiceWrongAnswer ||
      multipleChoiceRightAnswer
    ) {
      const isSingleChoice = !(
        multipleChoiceRightAnswer || multipleChoiceWrongAnswer
      )
      return {
        plugin: 'scMcExercise',
        state: {
          isSingleChoice: isSingleChoice,
          answers: [
            ...(singleChoiceRightAnswer
              ? [
                  {
                    id: convert(singleChoiceRightAnswer.content),
                    isCorrect: true,
                    feedback: convert(singleChoiceRightAnswer.feedback),
                    hasFeedback: !!singleChoiceRightAnswer.feedback
                  }
                ]
              : []),
            ...(singleChoiceWrongAnswer
              ? singleChoiceWrongAnswer.map(answer => {
                  return {
                    id: convert(answer.content),
                    isCorrect: false,
                    feedback: convert(answer.feedback),
                    hasFeedback: !!answer.feedback
                  }
                })
              : []),
            ...(multipleChoiceRightAnswer
              ? multipleChoiceRightAnswer.map(answer => {
                  return {
                    id: convert(answer.content),
                    isCorrect: true,
                    feedback: { plugin: 'rows', state: [{ plugin: 'text' }] },
                    hasFeedback: false
                  }
                })
              : []),
            ...(multipleChoiceWrongAnswer
              ? multipleChoiceWrongAnswer.map(answer => {
                  return {
                    id: convert(answer.content),
                    isCorrect: false,
                    feedback: convert(answer.feedback),
                    hasFeedback: !!answer.feedback
                  }
                })
              : [])
          ]
        }
      }
    }
  }
}

function convertArticle(
  state: ArticleState
): Plugin<'article', typeof articleState> {
  return {
    plugin: 'article',
    state: {
      ...state,
      content: toEdtr(state.content),
      reasoning: toEdtr(state.reasoning)
    }
  }
}

function toEdtr(content: Content): RowsPlugin {
  if (!content) return { plugin: 'rows', state: [] }
  if (isEdtr(content)) return content as RowsPlugin
  return convert(content) as RowsPlugin
}

interface ArticleState extends StandardElements {
  title: string
  content: Content
  reasoning: Content
  metaTitle: string
  metaDescription: string
}

interface TextExerciseState extends StandardElements {
  content: Content
  textSolution: TextSolutionState
  singleChoiceRightAnswer?: { content: Legacy, feedback: Legacy },
  singleChoiceWrongAnswer?: { content: Legacy, feedback: Legacy }[],
  multipleChoiceRightAnswer?: { content: Legacy }[],
  multipleChoiceWrongAnswer?: { content: Legacy, feedback: Legacy }[],
}

interface TextSolutionState extends StandardElements {
  title: string,
  content: Content
}

type Plugin<Type extends string, State extends StateType.StateDescriptor> = {
  plugin: Type
  state: StateDescriptorSerializedType<State>
}
type RowsPlugin = { plugin: 'rows'; state: unknown[] }

type Content = Legacy | Splish | Edtr | undefined
