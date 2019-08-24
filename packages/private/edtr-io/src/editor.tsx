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
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import * as React from 'react'

import {
  convert,
  Edtr,
  isEdtr,
  Legacy,
  Splish,
  RowsPlugin
} from '@serlo/legacy-editor-to-editor'

import { Entity, License, Uuid } from './plugins/entities/common'
import { appletTypeState } from './plugins/types/applet'
import { articleTypeState } from './plugins/types/article'
import { courseTypeState } from './plugins/types/course'
import { coursePageTypeState } from './plugins/types/course-page'
import { eventTypeState } from './plugins/types/event'
import { mathPuzzleTypeState } from './plugins/types/math-puzzle'
import { pageTypeState } from './plugins/types/page'
import { textExerciseTypeState } from './plugins/types/text-exercise'
import { textExerciseGroupTypeState } from './plugins/types/text-exercise-group'
import { textSolutionTypeState } from './plugins/types/text-solution'
import { userTypeState } from './plugins/types/user'
import { videoTypeState } from './plugins/types/video'
import { plugins } from './plugins'

export interface EditorProps {
  children?: React.ReactNode
  onSave: (data: unknown) => Promise<void>
  initialState: unknown
  type: string
}

export const SaveContext = React.createContext<EditorProps['onSave']>(() => {
  return Promise.reject()
})

export function Editor(props: EditorProps) {
  const initialState = deserialize(props)
  console.log('deserialized state', initialState)

  if (!initialState) {
    const url = window.location.pathname.replace(
      'add-revision',
      'add-revision-old'
    )
    return (
      <div className="alert alert-danger" role="alert">
        Dieser Inhaltstyp wird vom neuen Editor noch nicht unterstützt. Bitte
        erstelle eine Bearbeitung mit <a href={url}>dem alten Editor</a>.
      </div>
    )
  }

  return (
    <SaveContext.Provider value={props.onSave}>
      <div className="alert alert-warning" role="alert">
        <strong>Willkommen im neuen Serlo-Editor :)</strong>
        <br />
        Bitte beachte, dass sich der neue Editor noch in einer Testphase
        befindet. Du kannst dein Feedback in{' '}
        <a
          href="https://docs.google.com/document/d/1Lb_hB0zgwzIHgmDPY75XXJKVu5sa33UUwvNTQdRGALk/edit"
          target="_blank"
        >
          diesem Google Doc
        </a>{' '}
        hinterlassen (oder alternativ via Mail an jonas@serlo.org). Dort findest
        du auch eine Liste von bekannten Problemen und ggf. Workarounds.
      </div>
      <Core
        plugins={plugins}
        defaultPlugin="text"
        initialState={initialState}
        editable
      >
        {props.children}
      </Core>
    </SaveContext.Provider>
  )
}

function deserialize(props: EditorProps) {
  switch (props.type) {
    case 'applet': {
      return {
        plugin: 'type-applet',
        state: deserializeApplet(props.initialState as AppletState)
      }
    }
    case 'article':
      return {
        plugin: 'type-article',
        state: deserializeArticle(props.initialState as ArticleState)
      }
    case 'course': {
      return {
        plugin: 'type-course',
        state: deserializeCourse(props.initialState as CourseState)
      }
    }
    case 'course-page': {
      return {
        plugin: 'type-course-page',
        state: deserializeCoursePage(props.initialState as CoursePageState)
      }
    }
    case 'event':
      return {
        plugin: 'type-event',
        state: deserializeEvent(props.initialState as EventState)
      }
    case 'math-puzzle': {
      return {
        plugin: 'type-math-puzzle',
        state: deserializeMathPuzzle(props.initialState as MathPuzzleState)
      }
    }
    case 'page': {
      return {
        plugin: 'type-page',
        state: deserializePage(props.initialState as PageState)
      }
    }
    case 'grouped-text-exercise':
    case 'text-exercise':
      return {
        plugin: 'type-text-exercise',
        state: deserializeTextExercise(props.initialState as TextExerciseState)
      }
    case 'text-exercise-group':
      return {
        plugin: 'type-text-exercise-group',
        state: deserializeTextExerciseGroup(
          props.initialState as TextExerciseGroupState
        )
      }
    case 'text-solution':
      return {
        plugin: 'type-text-solution',
        state: deserializeTextSolution(props.initialState as TextSolutionState)
      }
    case 'user':
      return {
        plugin: 'type-user',
        state: deserializeUser(props.initialState as UserState)
      }
    case 'video':
      return {
        plugin: 'type-video',
        state: deserializeVideo(props.initialState as VideoState)
      }
    default:
      console.log(props)
      return null
  }

  function deserializeApplet(
    state: AppletState
  ): StateType.StateDescriptorSerializedType<typeof appletTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      reasoning: serializeEditorState(
        toEdtr(deserializeEditorState(state.reasoning))
      )
    }
  }

  function deserializeArticle(
    state: ArticleState
  ): StateType.StateDescriptorSerializedType<typeof articleTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      reasoning: serializeEditorState(
        toEdtr(deserializeEditorState(state.reasoning))
      )
    }
  }

  function deserializeCourse(
    state: CourseState
  ): StateType.StateDescriptorSerializedType<typeof courseTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      reasoning: serializeEditorState(
        toEdtr(deserializeEditorState(state.reasoning))
      ),
      'course-page': state['course-page'].map(deserializeCoursePage)
    }
  }

  function deserializeCoursePage(
    state: CoursePageState
  ): StateType.StateDescriptorSerializedType<typeof coursePageTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      icon: state.icon || 'explanation'
    }
  }

  function deserializeEvent(
    state: EventState
  ): StateType.StateDescriptorSerializedType<typeof eventTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeMathPuzzle(
    state: MathPuzzleState
  ): StateType.StateDescriptorSerializedType<typeof mathPuzzleTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializePage(
    state: PageState
  ): StateType.StateDescriptorSerializedType<typeof pageTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeTextExercise({
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
  }: TextExerciseState): StateType.StateDescriptorSerializedType<
    typeof textExerciseTypeState
  > {
    const deserialized = deserializeEditorState(content)

    const scMcExercise =
      deserialized && !isEdtr(deserialized)
        ? deserializeScMcExercise()
        : undefined

    const converted = toEdtr(deserialized)
    // const inputExercise = convertInputExercise({ inputExpressionEqualMatchChallenge, inputNumberExactMatchChallenge, inputStringNormalizedMatchChallenge })

    return {
      ...state,
      'text-solution': deserializeTextSolution(textSolution),
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
                        deserializeEditorState(singleChoiceRightAnswer.content)
                      ),
                      isCorrect: true,
                      feedback: convert(
                        deserializeEditorState(singleChoiceRightAnswer.feedback)
                      ),
                      hasFeedback: !!singleChoiceRightAnswer.feedback
                    }
                  ]
                : []),
              ...(singleChoiceWrongAnswer
                ? singleChoiceWrongAnswer.map(answer => {
                    return {
                      id: convert(deserializeEditorState(answer.content)),
                      isCorrect: false,
                      feedback: convert(
                        deserializeEditorState(answer.feedback)
                      ),
                      hasFeedback: !!answer.feedback
                    }
                  })
                : []),
              ...(multipleChoiceRightAnswer
                ? multipleChoiceRightAnswer.map(answer => {
                    return {
                      id: convert(deserializeEditorState(answer.content)),
                      isCorrect: true,
                      feedback: { plugin: 'rows', state: [{ plugin: 'text' }] },
                      hasFeedback: false
                    }
                  })
                : []),
              ...(multipleChoiceWrongAnswer
                ? multipleChoiceWrongAnswer.map(answer => {
                    return {
                      id: convert(deserializeEditorState(answer.content)),
                      isCorrect: false,
                      feedback: convert(
                        deserializeEditorState(answer.feedback)
                      ),
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

  function deserializeTextExerciseGroup(
    state: TextExerciseGroupState
  ): StateType.StateDescriptorSerializedType<
    typeof textExerciseGroupTypeState
  > {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      ),
      'grouped-text-exercise': state['grouped-text-exercise'].map(
        deserializeTextExercise
      )
    }
  }

  function deserializeTextSolution(
    state: TextSolutionState
  ): StateType.StateDescriptorSerializedType<typeof textSolutionTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeUser(
    state: UserState
  ): StateType.StateDescriptorSerializedType<typeof userTypeState> {
    return {
      ...state,
      description: serializeEditorState(
        toEdtr(deserializeEditorState(state.description))
      )
    }
  }

  function deserializeVideo(
    state: VideoState
  ): StateType.StateDescriptorSerializedType<typeof videoTypeState> {
    return {
      ...state,
      description: serializeEditorState(
        toEdtr(deserializeEditorState(state.description))
      )
    }
  }
}

function toEdtr(content: EditorState): RowsPlugin {
  if (!content) return { plugin: 'rows', state: [] }
  if (isEdtr(content)) return content as RowsPlugin
  return convert(content) as RowsPlugin
}

interface ArticleState extends Entity {
  title: string
  content: SerializedEditorState
  reasoning: SerializedEditorState
  meta_title: string
  meta_description: string
}

interface TextExerciseState extends Entity {
  content: SerializedEditorState
  'text-solution': TextSolutionState
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

interface TextExerciseGroupState extends Entity {
  content: SerializedEditorState
  'grouped-text-exercise': TextExerciseState[]
}

interface TextSolutionState extends Entity {
  title: string
  content: SerializedEditorState
}

interface CourseState extends Entity {
  title: string
  content: SerializedEditorState
  reasoning: SerializedEditorState
  meta_description: string
  'course-page': CoursePageState[]
}

interface CoursePageState extends Entity {
  icon?: 'explanation' | 'play' | 'question'
  title: string
  content: SerializedEditorState
}

interface AppletState extends Entity {
  title: string
  content: SerializedEditorState
  meta_description: string
  meta_title: string
  reasoning: SerializedEditorState
  url: string
}

interface VideoState extends Entity {
  title: string
  content: string
  description: SerializedEditorState
  reasoning: SerializedEditorState
}

interface MathPuzzleState extends Entity {
  content: SerializedEditorState
  source: string
}

interface EventState extends Entity {
  title: string
  content: SerializedEditorState
  meta_description: string
  meta_title: string
}

interface UserState extends Uuid {
  description: SerializedEditorState
}

interface PageState extends Uuid, License {
  title: string
  content: SerializedEditorState
}

function serializeEditorState(content: Legacy): SerializedLegacyEditorState
function serializeEditorState(content: EditorState): SerializedEditorState
function serializeEditorState(
  content: EditorState
): SerializedEditorState | SerializedLegacyEditorState {
  console.log('serialize', content)
  return content ? (JSON.stringify(content) as any) : undefined
}

function deserializeEditorState(content: SerializedLegacyEditorState): Legacy
function deserializeEditorState(content: SerializedEditorState): EditorState
function deserializeEditorState(
  content: SerializedLegacyEditorState | SerializedEditorState
): EditorState {
  console.log('deserialize', content)
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
