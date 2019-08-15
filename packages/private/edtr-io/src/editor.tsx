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
import { articleState } from './plugins/entities/article'
import {
  convert,
  Edtr,
  isEdtr,
  Legacy,
  Splish,
  RowsPlugin
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
  console.log('Editor', props)

  const converted = convertState(props)
  console.log('converted: ', converted)
  return (
    <Core
      plugins={plugins}
      defaultPlugin="text"
      initialState={converted}
      editable
    >
      {props.children}
    </Core>
  )
}

function convertState(props: EditorProps) {
  switch (props.type) {
    case 'article':
      return { plugin: 'article', state: convertArticle(props.initialState as ArticleState) }
    case 'text-exercise':
      return { plugin: 'textExercise', state: convertTextExercise(props.initialState as TextExerciseState) }
    default:
      throw new Error('NOOOO!')
  }
}

function convertTextSolution(
  state: TextSolutionState
): StateType.StateDescriptorSerializedType<typeof textSolutionState> {
  return {
    ...state,
    content: serializeContent(toEdtr(deserializeContent(state.content)))
  }
}

function convertTextExercise({
  content,
  'text-solution': textSolution,
  'single-choice-right-answer': singleChoiceRightAnswer,
  'single-choice-wrong-answer': singleChoiceWrongAnswer,
  'multiple-choice-right-answer': multipleChoiceRightAnswer,
  'multiple-choice-wrong-answer': multipleChoiceWrongAnswer,
  // inputExpressionEqualMatchChallenge,
  // inputNumberExactMatchChallenge,
  // inputStringNormalizedMatchChallenge,
  ...state
}: TextExerciseState): StateType.StateDescriptorSerializedType<typeof textExerciseState> {
  const deserialized = deserializeContent(content)

  const scMcExercise =
    deserialized && !isEdtr(deserialized) ? convertScMc() : undefined

  const converted = toEdtr(deserialized)
  // const inputExercise = convertInputExercise({ inputExpressionEqualMatchChallenge, inputNumberExactMatchChallenge, inputStringNormalizedMatchChallenge })

  return {
    ...state,
    'text-solution': convertTextSolution(textSolution),
    content: serializeContent({
      plugin: 'rows',
      state: [...converted.state, ...(scMcExercise ? [scMcExercise] : [])]
    })
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
                    id: convert(
                      deserializeContent(singleChoiceRightAnswer.content)
                    ),
                    isCorrect: true,
                    feedback: convert(
                      deserializeContent(singleChoiceRightAnswer.feedback)
                    ),
                    hasFeedback: !!singleChoiceRightAnswer.feedback
                  }
                ]
              : []),
            ...(singleChoiceWrongAnswer
              ? singleChoiceWrongAnswer.map(answer => {
                  return {
                    id: convert(deserializeContent(answer.content)),
                    isCorrect: false,
                    feedback: convert(deserializeContent(answer.feedback)),
                    hasFeedback: !!answer.feedback
                  }
                })
              : []),
            ...(multipleChoiceRightAnswer
              ? multipleChoiceRightAnswer.map(answer => {
                  return {
                    id: convert(deserializeContent(answer.content)),
                    isCorrect: true,
                    feedback: { plugin: 'rows', state: [{ plugin: 'text' }] },
                    hasFeedback: false
                  }
                })
              : []),
            ...(multipleChoiceWrongAnswer
              ? multipleChoiceWrongAnswer.map(answer => {
                  return {
                    id: convert(deserializeContent(answer.content)),
                    isCorrect: false,
                    feedback: convert(deserializeContent(answer.feedback)),
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
): StateType.StateDescriptorSerializedType<typeof articleState> {
  return {
    ...state,
    content: serializeContent(toEdtr(deserializeContent(state.content))),
    reasoning: serializeContent(toEdtr(deserializeContent(state.reasoning)))
  }
}

function toEdtr(content: Content): RowsPlugin {
  console.log('toEdtr')
  if (!content) return { plugin: 'rows', state: [] }
  if (isEdtr(content)) return content as RowsPlugin
  return convert(content) as RowsPlugin
}

interface ArticleState extends StandardElements {
  title: string
  content: SerializedContent
  reasoning: SerializedContent
  meta_title: string
  meta_description: string
}

interface TextExerciseState extends StandardElements {
  content: SerializedContent
  'text-solution': TextSolutionState
  'single-choice-right-answer'?: {
    content: SerializedLegacyContent
    feedback: SerializedLegacyContent
  }
  'single-choice-wrong-answer'?: {
    content: SerializedLegacyContent
    feedback: SerializedLegacyContent
  }[]
  'multiple-choice-right-answer'?: { content: SerializedLegacyContent }[]
  'multiple-choice-wrong-answer'?: {
    content: SerializedLegacyContent
    feedback: SerializedLegacyContent
  }[]
}

interface TextSolutionState extends StandardElements {
  title: string
  content: SerializedContent
}

function serializeContent(content: Legacy): SerializedLegacyContent
function serializeContent(content: Content): SerializedContent
function serializeContent(
  content: Content
): SerializedContent | SerializedLegacyContent {
  console.log('serialize', content)
  return content ? (JSON.stringify(content) as any) : undefined
}

function deserializeContent(content: SerializedLegacyContent): Legacy
function deserializeContent(content: SerializedContent): Content
function deserializeContent(
  content: SerializedLegacyContent | SerializedContent
): Content {
  console.log('deserialize', content)
  return content ? JSON.parse(content) : undefined
}

type Content = Legacy | Splish | Edtr | undefined
type SerializedContent = (string | undefined) & { __type: 'serialized-content' }
type SerializedLegacyContent = (string | undefined) & {
  __type: 'serialized-legacy-content'
}
