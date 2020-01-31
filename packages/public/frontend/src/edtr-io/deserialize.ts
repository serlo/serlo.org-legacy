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
import { StateType, StateTypeSerializedType } from '@edtr-io/plugin'
import { InputExerciseState } from '@edtr-io/plugin-input-exercise'
import { ScMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import * as R from 'ramda'

import { convert, isEdtr } from '../legacy/legacy-editor-to-editor'
import {
  Edtr,
  Legacy,
  LayoutPlugin,
  RowsPlugin,
  Splish
} from '../legacy/legacy-editor-to-editor/splishToEdtr/types'
import { appletTypeState } from './plugins/types/applet'
import { articleTypeState } from './plugins/types/article'
import { courseTypeState } from './plugins/types/course'
import { coursePageTypeState } from './plugins/types/course-page'
import { eventTypeState } from './plugins/types/event'
import { mathPuzzleTypeState } from './plugins/types/math-puzzle'
import { pageTypeState } from './plugins/types/page'
import { taxonomyTypeState } from './plugins/types/taxonomy'
import { textExerciseTypeState } from './plugins/types/text-exercise'
import { textExerciseGroupTypeState } from './plugins/types/text-exercise-group'
import { textSolutionTypeState } from './plugins/types/text-solution'
import { userTypeState } from './plugins/types/user'
import { videoTypeState } from './plugins/types/video'
import { Entity, License, Uuid } from './plugins/types/common'
import { EditorProps } from './editor'

const empty: RowsPlugin = { plugin: 'rows', state: [] }

export function deserialize({
  initialState,
  type,
  onError
}: Pick<EditorProps, 'initialState' | 'type' | 'onError'>): DeserializeResult {
  const stack: { id: number; type: string }[] = []
  try {
    switch (type) {
      case 'applet': {
        const deserialized = deserializeApplet(
          initialState as AppletSerializedState
        )
        return succeed(
          {
            plugin: 'type-applet',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'article': {
        const deserialized = deserializeArticle(
          initialState as ArticleSerializedState
        )
        return succeed(
          {
            plugin: 'type-article',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'course': {
        const deserialized = deserializeCourse(
          initialState as CourseSerializedState
        )
        return succeed(
          {
            plugin: 'type-course',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'course-page': {
        const deserialized = deserializeCoursePage(
          initialState as CoursePageSerializedState
        )
        return succeed(
          {
            plugin: 'type-course-page',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'event': {
        const deserialized = deserializeEvent(
          initialState as EventSerializedState
        )
        return succeed(
          {
            plugin: 'type-event',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'math-puzzle': {
        const deserialized = deserializeMathPuzzle(
          initialState as MathPuzzleSerializedState
        )
        return succeed(
          {
            plugin: 'type-math-puzzle',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'page': {
        const deserialized = deserializePage(
          initialState as PageSerializedState
        )
        return succeed(
          {
            plugin: 'type-page',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'grouped-text-exercise':
      case 'text-exercise': {
        const deserialized = deserializeTextExercise(
          initialState as TextExerciseSerializedState
        )
        return succeed(
          {
            plugin: 'type-text-exercise',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'text-exercise-group': {
        const deserialized = deserializeTextExerciseGroup(
          initialState as TextExerciseGroupSerializedState
        )
        return succeed(
          {
            plugin: 'type-text-exercise-group',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'text-solution': {
        const deserialized = deserializeTextSolution(
          initialState as TextSolutionSerializedState
        )
        return succeed(
          {
            plugin: 'type-text-solution',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'text-hint': {
        const deserialized = deserializeTextHint(
          initialState as TextHintSerializedState
        )
        return succeed(
          {
            plugin: 'type-text-hint',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'user': {
        const deserialized = deserializeUser(
          initialState as UserSerializedState
        )
        return succeed(
          {
            plugin: 'type-user',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'video': {
        const deserialized = deserializeVideo(
          initialState as VideoSerializedState
        )
        return succeed(
          {
            plugin: 'type-video',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      case 'taxonomy': {
        const deserialized = deserializeTaxonomy(
          initialState as TaxonomySerializedState
        )
        return succeed(
          {
            plugin: 'type-taxonomy',
            state: deserialized.state
          },
          deserialized.converted
        )
      }
      default:
        return {
          error: 'type-unsupported'
        }
    }
  } catch (e) {
    if (typeof onError === 'function') {
      onError(e, {
        stack: JSON.stringify(stack)
      })
    }
    return {
      error: 'failure'
    }
  }

  function succeed(
    initialState: DeserializeSuccess['initialState'],
    converted: boolean
  ): DeserializeSuccess {
    return {
      success: true,
      initialState,
      converted
    }
  }

  function deserializeApplet(
    state: AppletSerializedState
  ): DeserializedState<typeof appletTypeState> {
    stack.push({ id: state.id, type: 'applet' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        url: state.url || '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        ),
        reasoning: serializeEditorState(
          toEdtr(deserializeEditorState(state.reasoning))
        ),
        meta_title: state.meta_title || '',
        meta_description: state.meta_description || ''
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeArticle(
    state: ArticleSerializedState
  ): DeserializedState<typeof articleTypeState> {
    stack.push({ id: state.id, type: 'article' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        ),
        reasoning: serializeEditorState(
          toEdtr(deserializeEditorState(state.reasoning))
        ),
        meta_title: state.meta_title || '',
        meta_description: state.meta_description || ''
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeCourse(
    state: CourseSerializedState
  ): DeserializedState<typeof courseTypeState> {
    stack.push({ id: state.id, type: 'course' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        description: serializeEditorState(
          toEdtr(deserializeEditorState(state.description))
        ),
        reasoning: serializeEditorState(
          toEdtr(deserializeEditorState(state.reasoning))
        ),
        meta_description: state.meta_description || '',
        'course-page': (state['course-page'] || []).map(
          s => deserializeCoursePage(s).state
        )
      },
      converted: !isEdtr(deserializeEditorState(state.description) || empty)
    }
  }

  function deserializeCoursePage(
    state: CoursePageSerializedState
  ): DeserializedState<typeof coursePageTypeState> {
    stack.push({ id: state.id, type: 'course-page' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        icon: state.icon || 'explanation',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        )
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeEvent(
    state: EventSerializedState
  ): DeserializedState<typeof eventTypeState> {
    stack.push({ id: state.id, type: 'event' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        ),
        meta_title: state.meta_title || '',
        meta_description: state.meta_description || ''
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeMathPuzzle(
    state: MathPuzzleSerializedState
  ): DeserializedState<typeof mathPuzzleTypeState> {
    stack.push({ id: state.id, type: 'math-puzzle' })
    return {
      state: {
        ...state,
        changes: '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        ),
        source: state.source || ''
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializePage(
    state: PageSerializedState
  ): DeserializedState<typeof pageTypeState> {
    stack.push({ id: state.id, type: 'page' })
    return {
      state: {
        ...state,
        title: state.title || '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        )
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeTaxonomy(
    state: TaxonomySerializedState
  ): DeserializedState<typeof taxonomyTypeState> {
    stack.push({ id: state.id, type: 'taxonomy' })
    return {
      state: {
        ...state,
        term: state.term,
        description: serializeEditorState(
          toEdtr(deserializeEditorState(state.description))
        )
      },
      converted: false // no legacy editor for taxonomies
    }
  }

  function deserializeTextExercise({
    content,
    'text-hint': textHint,
    'text-solution': textSolution,
    'single-choice-right-answer': singleChoiceRightAnswer,
    'single-choice-wrong-answer': singleChoiceWrongAnswer,
    'multiple-choice-right-answer': multipleChoiceRightAnswer,
    'multiple-choice-wrong-answer': multipleChoiceWrongAnswer,
    'input-expression-equal-match-challenge': inputExpressionEqualMatchChallenge,
    'input-number-exact-match-challenge': inputNumberExactMatchChallenge,
    'input-string-normalized-match-challenge': inputStringNormalizedMatchChallenge,
    ...state
  }: TextExerciseSerializedState): DeserializedState<
    typeof textExerciseTypeState
  > {
    stack.push({ id: state.id, type: 'text-exercise' })
    const deserialized = deserializeEditorState(content)

    const scMcExercise =
      deserialized && !isEdtr(deserialized)
        ? deserializeScMcExercise()
        : undefined

    const inputExercise =
      deserialized && !isEdtr(deserialized)
        ? deserializeInputExercise()
        : undefined

    const converted = toEdtr(deserialized) as RowsPlugin

    return {
      state: {
        ...state,
        changes: '',
        'text-hint': textHint ? deserializeTextHint(textHint).state : '',
        'text-solution': textSolution
          ? deserializeTextSolution(textSolution).state
          : '',
        content: serializeEditorState({
          plugin: 'rows',
          state: [
            ...converted.state,
            ...(scMcExercise ? [scMcExercise] : []),
            ...(inputExercise ? [inputExercise] : [])
          ]
        })
      },
      converted: !isEdtr(deserialized || empty)
    }

    function deserializeScMcExercise():
      | {
          plugin: 'scMcExercise'
          state: StateTypeSerializedType<ScMcExerciseState>
        }
      | undefined {
      stack.push({ id: state.id, type: 'sc-mc-exercise' })
      if (
        singleChoiceWrongAnswer ||
        singleChoiceRightAnswer ||
        multipleChoiceWrongAnswer ||
        multipleChoiceRightAnswer
      ) {
        const convertedSCRightAnswers =
          singleChoiceRightAnswer && singleChoiceRightAnswer.content
            ? [
                {
                  content: extractChildFromRows(
                    convert(
                      deserializeEditorState(singleChoiceRightAnswer.content)
                    )
                  ),
                  isCorrect: true,
                  feedback: extractChildFromRows(
                    convert(
                      deserializeEditorState(singleChoiceRightAnswer.feedback)
                    )
                  )
                }
              ]
            : []
        const convertedSCWrongAnswers = singleChoiceWrongAnswer
          ? singleChoiceWrongAnswer
              .filter(answer => {
                return answer.content
              })
              .map(answer => {
                return {
                  content: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: false,
                  feedback: extractChildFromRows(
                    convert(deserializeEditorState(answer.feedback))
                  )
                }
              })
          : []

        const convertedMCRightAnswers = multipleChoiceRightAnswer
          ? multipleChoiceRightAnswer
              .filter(answer => {
                return answer.content
              })
              .map(answer => {
                return {
                  content: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: true,
                  feedback: {
                    plugin: 'text'
                  }
                }
              })
          : []

        const convertedMCWrongAnswers = multipleChoiceWrongAnswer
          ? multipleChoiceWrongAnswer
              .filter(answer => {
                return answer.content
              })
              .map(answer => {
                return {
                  content: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: false,
                  feedback: extractChildFromRows(
                    convert(deserializeEditorState(answer.feedback))
                  )
                }
              })
          : []
        const isSingleChoice = !(
          convertedMCRightAnswers.length || convertedMCWrongAnswers.length
        )
        return {
          plugin: 'scMcExercise',
          state: {
            isSingleChoice: isSingleChoice,
            answers: [
              ...(isSingleChoice ? convertedSCRightAnswers : []),
              ...(isSingleChoice ? convertedSCWrongAnswers : []),
              ...(!isSingleChoice ? convertedMCRightAnswers : []),
              ...(!isSingleChoice ? convertedMCWrongAnswers : [])
            ]
          }
        }
      }
    }

    function deserializeInputExercise():
      | {
          plugin: 'inputExercise'
          state: StateTypeSerializedType<InputExerciseState>
        }
      | undefined {
      if (
        inputStringNormalizedMatchChallenge ||
        inputNumberExactMatchChallenge ||
        inputExpressionEqualMatchChallenge
      ) {
        const type = inputStringNormalizedMatchChallenge
          ? 'input-string-normalized-match-challenge'
          : inputNumberExactMatchChallenge
          ? 'input-number-exact-match-challenge'
          : 'input-expression-equal-match-challenge'

        const inputExercises = filterDefined([
          inputStringNormalizedMatchChallenge,
          inputNumberExactMatchChallenge,
          inputExpressionEqualMatchChallenge
        ])

        return {
          plugin: 'inputExercise',
          state: {
            type,
            answers: extractInputAnswers(inputExercises, true),
            unit: ''
          }
        }
      }

      function extractInputAnswers(
        inputExercises: InputType[],
        isCorrect: boolean
      ): {
        value: string
        isCorrect: boolean
        feedback: { plugin: string; state?: unknown }
      }[] {
        if (inputExercises.length === 0) return []

        const answers = inputExercises.map(exercise => {
          return {
            value: exercise.solution,
            feedback: extractChildFromRows(
              convert(deserializeEditorState(exercise.feedback))
            ),
            isCorrect
          }
        })

        const children = R.flatten(
          inputExercises.map(exercise => {
            return filterDefined([
              exercise['input-string-normalized-match-challenge'],
              exercise['input-number-exact-match-challenge'],
              exercise['input-expression-equal-match-challenge']
            ])
          })
        )

        return R.concat(answers, extractInputAnswers(children, false))
      }

      function filterDefined<T>(array: (T | undefined)[]): T[] {
        return array.filter(el => typeof el !== 'undefined') as T[]
      }
    }
  }

  function extractChildFromRows(plugin: RowsPlugin) {
    return plugin.state.length ? plugin.state[0] : { plugin: 'text' }
  }

  function deserializeTextExerciseGroup(
    state: TextExerciseGroupSerializedState
  ): DeserializedState<typeof textExerciseGroupTypeState> {
    stack.push({ id: state.id, type: 'text-exercise-group' })
    return {
      state: {
        ...state,
        changes: '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        ),
        'grouped-text-exercise': (state['grouped-text-exercise'] || []).map(
          s => deserializeTextExercise(s).state
        )
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeTextHint(
    state: TextHintSerializedState
  ): DeserializedState<typeof textSolutionTypeState> {
    stack.push({ id: state.id, type: 'text-hint' })
    return {
      state: {
        ...state,
        changes: '',
        content: serializeEditorState(
          toEdtr(deserializeEditorState(state.content))
        )
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeTextSolution(
    state: TextSolutionSerializedState
  ): DeserializedState<typeof textSolutionTypeState> {
    stack.push({ id: state.id, type: 'text-solution' })

    const content: Edtr = toEdtr(deserializeEditorState(state.content))
    return {
      state: {
        ...state,
        changes: '',
        content:
          isEdtr(content) && content.plugin === 'solution'
            ? serializeEditorState(content)
            : serializeEditorState({
                plugin: 'solution',
                state: [
                  {
                    plugin: 'solutionSteps',
                    state: {
                      introduction: (content as RowsPlugin).state[0],
                      strategy: undefined,
                      solutionSteps: rowsToSolutionSteps(
                        R.tail((content as RowsPlugin).state)
                      ),
                      additionals: undefined
                    }
                  }
                ]
              })
      },
      converted: !isEdtr(deserializeEditorState(state.content) || empty)
    }
  }

  function deserializeUser(
    state: UserSerializedState
  ): DeserializedState<typeof userTypeState> {
    stack.push({ id: state.id, type: 'user' })
    return {
      state: {
        ...state,
        description: serializeEditorState(
          toEdtr(deserializeEditorState(state.description))
        )
      },
      converted: false // no legacy-editor for users
    }
  }

  function deserializeVideo(
    state: VideoSerializedState
  ): DeserializedState<typeof videoTypeState> {
    stack.push({ id: state.id, type: 'video' })
    return {
      state: {
        ...state,
        changes: '',
        title: state.title || '',
        description: serializeEditorState(
          toEdtr(deserializeEditorState(state.description))
        ),
        content: state.content || '',
        reasoning: serializeEditorState(
          toEdtr(deserializeEditorState(state.reasoning))
        )
      },
      converted: !isEdtr(deserializeEditorState(state.description) || empty)
    }
  }

  interface AppletSerializedState extends Entity {
    title?: string
    url?: string
    content: SerializedEditorState
    reasoning: SerializedEditorState
    meta_title?: string
    meta_description?: string
  }

  interface ArticleSerializedState extends Entity {
    title?: string
    content: SerializedEditorState
    reasoning: SerializedEditorState
    meta_title?: string
    meta_description?: string
  }

  interface CourseSerializedState extends Entity {
    title?: string
    description: SerializedEditorState
    reasoning: SerializedEditorState
    meta_description?: string
    'course-page'?: CoursePageSerializedState[]
  }

  interface CoursePageSerializedState extends Entity {
    title?: string
    icon?: 'explanation' | 'play' | 'question'
    content: SerializedEditorState
  }

  interface EventSerializedState extends Entity {
    title?: string
    content: SerializedEditorState
    meta_title?: string
    meta_description?: string
  }

  interface MathPuzzleSerializedState extends Entity {
    content: SerializedEditorState
    source?: string
  }

  interface PageSerializedState extends Uuid, License {
    title?: string
    content: SerializedEditorState
  }

  interface TaxonomySerializedState extends Uuid {
    term: {
      name: string
    }
    description: SerializedEditorState
    taxonomy: number
    parent: number
    position: number
  }

  interface TextExerciseSerializedState extends Entity {
    content: SerializedEditorState
    'text-hint'?: TextHintSerializedState
    'text-solution'?: TextSolutionSerializedState
    'single-choice-right-answer'?: {
      content: SerializedLegacyEditorState
      feedback: SerializedLegacyEditorState
    }
    'single-choice-wrong-answer'?: {
      content: SerializedLegacyEditorState
      feedback: SerializedLegacyEditorState
    }[]
    'multiple-choice-right-answer'?: { content: SerializedLegacyEditorState }[]
    'multiple-choice-wrong-answer'?: {
      content: SerializedLegacyEditorState
      feedback: SerializedLegacyEditorState
    }[]
    'input-expression-equal-match-challenge'?: InputType
    'input-number-exact-match-challenge'?: InputType
    'input-string-normalized-match-challenge': InputType
  }

  interface InputType {
    solution: string
    feedback: SerializedLegacyEditorState
    'input-expression-equal-match-challenge'?: InputType[]
    'input-number-exact-match-challenge'?: InputType[]
    'input-string-normalized-match-challenge'?: InputType[]
  }

  interface TextExerciseGroupSerializedState extends Entity {
    content: SerializedEditorState
    'grouped-text-exercise'?: TextExerciseSerializedState[]
  }

  interface TextHintSerializedState extends Entity {
    content: SerializedEditorState
  }

  interface TextSolutionSerializedState extends Entity {
    content: SerializedEditorState
  }

  interface UserSerializedState extends Uuid {
    description: SerializedEditorState
  }

  interface VideoSerializedState extends Entity {
    title?: string
    description: SerializedEditorState
    content?: string
    reasoning: SerializedEditorState
  }
}

export interface DeserializedState<T extends StateType> {
  state: StateTypeSerializedType<T>
  converted: boolean
}

export function isError(result: DeserializeResult): result is DeserializeError {
  return !!(result as DeserializeError).error
}

export type DeserializeResult = DeserializeSuccess | DeserializeError
export type DeserializeSuccess = {
  success: true
  initialState: {
    plugin: string
    state?: unknown
  }
  converted: boolean
}
export type DeserializeError =
  | { error: 'type-unsupported' }
  | { error: 'failure' }

function toEdtr(content: EditorState): Edtr {
  if (!content)
    return { plugin: 'rows', state: [{ plugin: 'text', state: undefined }] }
  if (isEdtr(content)) return content
  return convert(content)
}

function serializeEditorState(content: Legacy): SerializedLegacyEditorState
function serializeEditorState(content: EditorState): SerializedEditorState
function serializeEditorState(
  content: EditorState
): SerializedEditorState | SerializedLegacyEditorState {
  return content ? (JSON.stringify(content) as any) : undefined
}

function deserializeEditorState(content: SerializedLegacyEditorState): Legacy
function deserializeEditorState(content: SerializedEditorState): EditorState
function deserializeEditorState(
  content: SerializedLegacyEditorState | SerializedEditorState
): EditorState {
  return content ? JSON.parse(content) : undefined
}

type EditorState = Legacy | Splish | Edtr | undefined

// Fake `__type` property is just here to let TypeScript distinguish between the types
type SerializedEditorState = (string | undefined) & {
  __type: 'serialized-editor-state'
}
type SerializedLegacyEditorState = (string | undefined) & {
  __type: 'serialized-legacy-editor-state'
}

export function rowsToSolutionSteps(rows: Edtr[]) {
  const solutionSteps: { type: string; isHalf: boolean; content: Edtr }[] = []

  rows.forEach(row => {
    if (row.plugin === 'layout' && (row as LayoutPlugin).state.length === 2) {
      const layoutPlugin = row
      const leftElement = {
        type: 'step',
        isHalf: true,
        content: (layoutPlugin as LayoutPlugin).state[0].child
      }
      const rightElement = {
        type: 'explanation',
        isHalf: true,
        content: (layoutPlugin as LayoutPlugin).state[1].child
      }
      solutionSteps.push(leftElement)
      solutionSteps.push(rightElement)
    } else {
      solutionSteps.push({ type: 'step', isHalf: false, content: row })
    }
  })

  return solutionSteps
}
