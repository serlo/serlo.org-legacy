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

import { StandardElements } from './plugins/entities/common'
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
  const converted = convertState(props)
  console.log('converted', converted)

  if (!converted) {
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
        initialState={converted}
        editable
      >
        {props.children}
      </Core>
    </SaveContext.Provider>
  )
}

function convertState(props: EditorProps) {
  switch (props.type) {
    case 'applet': {
      return {
        plugin: 'type-applet',
        state: convertApplet(props.initialState as AppletState)
      }
    }
    case 'article':
      return {
        plugin: 'type-article',
        state: convertArticle(props.initialState as ArticleState)
      }
    case 'course': {
      return {
        plugin: 'type-course',
        state: convertCourse(props.initialState as CourseState)
      }
    }
    case 'course-page': {
      return {
        plugin: 'type-course-page',
        state: convertCoursePage(props.initialState as CoursePageState)
      }
    }
    case 'event':
      return {
        plugin: 'type-event',
        state: convertEvent(props.initialState as EventState)
      }
    case 'math-puzzle': {
      return {
        plugin: 'type-math-puzzle',
        state: convertMathPuzzle(props.initialState as MathPuzzleState)
      }
    }
    case 'page': {
      return {
        plugin: 'type-page',
        state: convertPage(props.initialState as PageState)
      }
    }
    case 'grouped-text-exercise':
    case 'text-exercise':
      return {
        plugin: 'type-text-exercise',
        state: convertTextExercise(props.initialState as TextExerciseState)
      }
    case 'text-exercise-group':
      return {
        plugin: 'type-text-exercise-group',
        state: convertTextExerciseGroup(
          props.initialState as TextExerciseGroupState
        )
      }
    case 'text-solution':
      return {
        plugin: 'type-text-solution',
        state: convertTextSolution(props.initialState as TextSolutionState)
      }
    case 'user':
      return {
        plugin: 'type-user',
        state: convertUser(props.initialState as UserState)
      }
    case 'video':
      return {
        plugin: 'type-video',
        state: convertVideo(props.initialState as VideoState)
      }
    default:
      console.log(props)
      return null
  }

  function convertApplet(
    state: AppletState
  ): StateType.StateDescriptorSerializedType<typeof appletTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content))),
      reasoning: serializeContent(toEdtr(deserializeContent(state.reasoning)))
    }
  }

  function convertArticle(
    state: ArticleState
  ): StateType.StateDescriptorSerializedType<typeof articleTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content))),
      reasoning: serializeContent(toEdtr(deserializeContent(state.reasoning)))
    }
  }

  function convertCourse(
    state: CourseState
  ): StateType.StateDescriptorSerializedType<typeof courseTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content))),
      reasoning: serializeContent(toEdtr(deserializeContent(state.reasoning))),
      'course-page': state['course-page'].map(convertCoursePage)
    }
  }

  function convertCoursePage(
    state: CoursePageState
  ): StateType.StateDescriptorSerializedType<typeof coursePageTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content))),
      icon: state.icon || 'explanation'
    }
  }

  function convertEvent(
    state: EventState
  ): StateType.StateDescriptorSerializedType<typeof eventTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content)))
    }
  }

  function convertMathPuzzle(
    state: MathPuzzleState
  ): StateType.StateDescriptorSerializedType<typeof mathPuzzleTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content)))
    }
  }

  function convertPage(
    state: PageState
  ): StateType.StateDescriptorSerializedType<typeof pageTypeState> {
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
  }: TextExerciseState): StateType.StateDescriptorSerializedType<
    typeof textExerciseTypeState
  > {
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

  function convertTextExerciseGroup(
    state: TextExerciseGroupState
  ): StateType.StateDescriptorSerializedType<
    typeof textExerciseGroupTypeState
  > {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content))),
      'grouped-text-exercise': state['grouped-text-exercise'].map(
        convertTextExercise
      )
    }
  }

  function convertTextSolution(
    state: TextSolutionState
  ): StateType.StateDescriptorSerializedType<typeof textSolutionTypeState> {
    return {
      ...state,
      content: serializeContent(toEdtr(deserializeContent(state.content)))
    }
  }

  function convertUser(
    state: UserState
  ): StateType.StateDescriptorSerializedType<typeof userTypeState> {
    return {
      ...state,
      description: serializeContent(
        toEdtr(deserializeContent(state.description))
      )
    }
  }

  function convertVideo(
    state: VideoState
  ): StateType.StateDescriptorSerializedType<typeof videoTypeState> {
    return {
      ...state,
      description: serializeContent(
        toEdtr(deserializeContent(state.description))
      )
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

interface TextExerciseGroupState extends StandardElements {
  content: SerializedContent
  'grouped-text-exercise': TextExerciseState[]
}

interface TextSolutionState extends StandardElements {
  title: string
  content: SerializedContent
}

interface CourseState extends StandardElements {
  title: string
  content: SerializedContent
  reasoning: SerializedContent
  meta_description: string
  'course-page': CoursePageState[]
}

interface CoursePageState extends StandardElements {
  icon?: 'explanation' | 'play' | 'question'
  title: string
  content: SerializedContent
}

interface AppletState extends StandardElements {
  title: string
  content: SerializedContent
  meta_description: string
  meta_title: string
  reasoning: SerializedContent
  url: string
}

interface VideoState extends StandardElements {
  title: string
  content: string
  description: SerializedContent
  reasoning: SerializedContent
}

interface MathPuzzleState extends StandardElements {
  content: SerializedContent
  source: string
}

interface EventState extends StandardElements {
  title: string
  content: SerializedContent
  meta_description: string
  meta_title: string
}

interface UserState {
  description: SerializedContent
}

interface PageState {
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
