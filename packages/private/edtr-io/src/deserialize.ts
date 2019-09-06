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
import { StateType } from '@edtr-io/core'
import {
  convert,
  isEdtr,
  Edtr,
  Legacy,
  RowsPlugin,
  Splish
} from '@serlo/legacy-editor-to-editor'

import { appletTypeState } from './plugins/types/applet'
import { articleTypeState } from './plugins/types/article'
import { courseTypeState } from './plugins/types/course'
import { coursePageTypeState } from './plugins/types/course-page'
import { eventTypeState } from './plugins/types/event'
import { mathPuzzleTypeState } from './plugins/types/math-puzzle'
import { pageTypeState } from './plugins/types/page'
import { textExerciseTypeState } from './plugins/types/text-exercise'
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import { textExerciseGroupTypeState } from './plugins/types/text-exercise-group'
import { textSolutionTypeState } from './plugins/types/text-solution'
import { userTypeState } from './plugins/types/user'
import { videoTypeState } from './plugins/types/video'
import { Entity, License, Uuid } from './plugins/types/common'
import { EditorProps } from './editor'

export function deserialize({
  initialState,
  type,
  onError
}: EditorProps): DeserializeResult {
  const stack: { id: number; type: string }[] = []
  try {
    switch (type) {
      case 'applet': {
        return succeed({
          plugin: 'type-applet',
          state: deserializeApplet(initialState as AppletSerializedState)
        })
      }
      case 'article':
        return succeed({
          plugin: 'type-article',
          state: deserializeArticle(initialState as ArticleSerializedState)
        })
      case 'course': {
        return succeed({
          plugin: 'type-course',
          state: deserializeCourse(initialState as CourseSerializedState)
        })
      }
      case 'course-page': {
        return succeed({
          plugin: 'type-course-page',
          state: deserializeCoursePage(
            initialState as CoursePageSerializedState
          )
        })
      }
      case 'event':
        return succeed({
          plugin: 'type-event',
          state: deserializeEvent(initialState as EventSerializedState)
        })
      case 'math-puzzle': {
        return succeed({
          plugin: 'type-math-puzzle',
          state: deserializeMathPuzzle(
            initialState as MathPuzzleSerializedState
          )
        })
      }
      case 'page': {
        return succeed({
          plugin: 'type-page',
          state: deserializePage(initialState as PageSerializedState)
        })
      }
      case 'grouped-text-exercise':
      case 'text-exercise':
        return succeed({
          plugin: 'type-text-exercise',
          state: deserializeTextExercise(
            initialState as TextExerciseSerializedState
          )
        })
      case 'text-exercise-group':
        return succeed({
          plugin: 'type-text-exercise-group',
          state: deserializeTextExerciseGroup(
            initialState as TextExerciseGroupSerializedState
          )
        })
      case 'text-solution':
        return succeed({
          plugin: 'type-text-solution',
          state: deserializeTextSolution(
            initialState as TextSolutionSerializedState
          )
        })
      case 'user':
        return succeed({
          plugin: 'type-user',
          state: deserializeUser(initialState as UserSerializedState)
        })
      case 'video':
        return succeed({
          plugin: 'type-video',
          state: deserializeVideo(initialState as VideoSerializedState)
        })
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
    initialState: DeserializeSuccess['initialState']
  ): DeserializeSuccess {
    return {
      success: true,
      initialState
    }
  }

  function deserializeApplet(
    state: AppletSerializedState
  ): StateType.StateDescriptorSerializedType<typeof appletTypeState> {
    stack.push({ id: state.id, type: 'applet' })
    return {
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
    }
  }

  function deserializeArticle(
    state: ArticleSerializedState
  ): StateType.StateDescriptorSerializedType<typeof articleTypeState> {
    stack.push({ id: state.id, type: 'article' })
    return {
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
    }
  }

  function deserializeCourse(
    state: CourseSerializedState
  ): StateType.StateDescriptorSerializedType<typeof courseTypeState> {
    stack.push({ id: state.id, type: 'course' })
    return {
      ...state,
      changes: '',
      title: state.title || '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      reasoning: serializeEditorState(
        toEdtr(deserializeEditorState(state.reasoning))
      ),
      meta_description: state.meta_description || '',
      'course-page': (state['course-page'] || []).map(deserializeCoursePage)
    }
  }

  function deserializeCoursePage(
    state: CoursePageSerializedState
  ): StateType.StateDescriptorSerializedType<typeof coursePageTypeState> {
    stack.push({ id: state.id, type: 'course-page' })
    return {
      ...state,
      changes: '',
      title: state.title || '',
      icon: state.icon || 'explanation',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeEvent(
    state: EventSerializedState
  ): StateType.StateDescriptorSerializedType<typeof eventTypeState> {
    stack.push({ id: state.id, type: 'event' })
    return {
      ...state,
      changes: '',
      title: state.title || '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      meta_title: state.meta_title || '',
      meta_description: state.meta_description || ''
    }
  }

  function deserializeMathPuzzle(
    state: MathPuzzleSerializedState
  ): StateType.StateDescriptorSerializedType<typeof mathPuzzleTypeState> {
    stack.push({ id: state.id, type: 'math-puzzle' })
    return {
      ...state,
      changes: '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      source: state.source || ''
    }
  }

  function deserializePage(
    state: PageSerializedState
  ): StateType.StateDescriptorSerializedType<typeof pageTypeState> {
    stack.push({ id: state.id, type: 'page' })
    return {
      ...state,
      title: state.title || '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
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
    // inputExpressionEqualMatchChallenge,
    // inputNumberExactMatchChallenge,
    // inputStringNormalizedMatchChallenge,
    ...state
  }: TextExerciseSerializedState): StateType.StateDescriptorSerializedType<
    typeof textExerciseTypeState
  > {
    stack.push({ id: state.id, type: 'text-exercise' })
    const deserialized = deserializeEditorState(content)

    const scMcExercise =
      deserialized && !isEdtr(deserialized)
        ? deserializeScMcExercise()
        : undefined

    const converted = toEdtr(deserialized)
    // const inputExercise = convertInputExercise({ inputExpressionEqualMatchChallenge, inputNumberExactMatchChallenge, inputStringNormalizedMatchChallenge })

    return {
      ...state,
      changes: '',
      'text-hint': textHint ? deserializeTextHint(textHint) : '',
      'text-solution': textSolution
        ? deserializeTextSolution(textSolution)
        : '',
      content: serializeEditorState({
        plugin: 'rows',
        state: [...converted.state, ...(scMcExercise ? [scMcExercise] : [])]
      })
    }

    function deserializeScMcExercise():
      | {
          plugin: 'scMcExercise'
          state: StateType.StateDescriptorSerializedType<
            typeof scMcExerciseState
          >
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
                  id: extractChildFromRows(
                    convert(
                      deserializeEditorState(singleChoiceRightAnswer.content)
                    )
                  ),
                  isCorrect: true,
                  feedback: extractChildFromRows(
                    convert(
                      deserializeEditorState(singleChoiceRightAnswer.feedback)
                    )
                  ),
                  hasFeedback: !!singleChoiceRightAnswer.feedback
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
                  id: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: false,
                  feedback: extractChildFromRows(
                    convert(deserializeEditorState(answer.feedback))
                  ),
                  hasFeedback: !!answer.feedback
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
                  id: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: true,
                  feedback: {
                    plugin: 'text'
                  },
                  hasFeedback: false
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
                  id: extractChildFromRows(
                    convert(deserializeEditorState(answer.content))
                  ),
                  isCorrect: false,
                  feedback: extractChildFromRows(
                    convert(deserializeEditorState(answer.feedback))
                  ),
                  hasFeedback: !!answer.feedback
                }
              })
          : []
        console.log(
          convertedSCWrongAnswers,
          convertedSCRightAnswers,
          convertedMCWrongAnswers,
          convertedMCRightAnswers
        )
        const isSingleChoice = !(
          convertedMCRightAnswers.length || convertedMCWrongAnswers.length
        )
        console.log('isSingleChoice', isSingleChoice)
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
  }

  function extractChildFromRows(plugin: RowsPlugin) {
    return plugin.state.length ? plugin.state[0] : { plugin: 'text' }
  }

  function deserializeTextExerciseGroup(
    state: TextExerciseGroupSerializedState
  ): StateType.StateDescriptorSerializedType<
    typeof textExerciseGroupTypeState
  > {
    stack.push({ id: state.id, type: 'text-exercise-group' })
    return {
      ...state,
      changes: '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      'grouped-text-exercise': (state['grouped-text-exercise'] || []).map(
        deserializeTextExercise
      )
    }
  }

  function deserializeTextHint(
    state: TextHintSerializedState
  ): StateType.StateDescriptorSerializedType<typeof textSolutionTypeState> {
    stack.push({ id: state.id, type: 'text-hint' })
    return {
      ...state,
      changes: '',
      // FIXME: hints don't have a title
      title: '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeTextSolution(
    state: TextSolutionSerializedState
  ): StateType.StateDescriptorSerializedType<typeof textSolutionTypeState> {
    stack.push({ id: state.id, type: 'text-solution' })
    return {
      ...state,
      changes: '',
      // FIXME: solutions don't have a title
      title: '',
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeUser(
    state: UserSerializedState
  ): StateType.StateDescriptorSerializedType<typeof userTypeState> {
    stack.push({ id: state.id, type: 'user' })
    return {
      ...state,
      description: serializeEditorState(
        toEdtr(deserializeEditorState(state.description))
      )
    }
  }

  function deserializeVideo(
    state: VideoSerializedState
  ): StateType.StateDescriptorSerializedType<typeof videoTypeState> {
    stack.push({ id: state.id, type: 'video' })
    return {
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
    content: SerializedEditorState
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
}
export type DeserializeError =
  | { error: 'type-unsupported' }
  | { error: 'failure' }

function toEdtr(content: EditorState): RowsPlugin {
  if (!content)
    return { plugin: 'rows', state: [{ plugin: 'text', state: undefined }] }
  if (isEdtr(content)) return content as RowsPlugin
  return convert(content) as RowsPlugin
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
