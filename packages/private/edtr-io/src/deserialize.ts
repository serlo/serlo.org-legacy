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
import { Entity, License, Uuid } from './plugins/entities/common'
import { EditorProps } from './editor'

export function deserialize({ initialState, type }: EditorProps) {
  switch (type) {
    case 'applet': {
      return {
        plugin: 'type-applet',
        state: deserializeApplet(initialState as AppletSerializedState)
      }
    }
    case 'article':
      return {
        plugin: 'type-article',
        state: deserializeArticle(initialState as ArticleSerializedState)
      }
    case 'course': {
      return {
        plugin: 'type-course',
        state: deserializeCourse(initialState as CourseSerializedState)
      }
    }
    case 'course-page': {
      return {
        plugin: 'type-course-page',
        state: deserializeCoursePage(initialState as CoursePageSerializedState)
      }
    }
    case 'event':
      return {
        plugin: 'type-event',
        state: deserializeEvent(initialState as EventSerializedState)
      }
    case 'math-puzzle': {
      return {
        plugin: 'type-math-puzzle',
        state: deserializeMathPuzzle(initialState as MathPuzzleSerializedState)
      }
    }
    case 'page': {
      return {
        plugin: 'type-page',
        state: deserializePage(initialState as PageSerializedState)
      }
    }
    case 'grouped-text-exercise':
    case 'text-exercise':
      return {
        plugin: 'type-text-exercise',
        state: deserializeTextExercise(
          initialState as TextExerciseSerializedState
        )
      }
    case 'text-exercise-group':
      return {
        plugin: 'type-text-exercise-group',
        state: deserializeTextExerciseGroup(
          initialState as TextExerciseGroupSerializedState
        )
      }
    case 'text-solution':
      return {
        plugin: 'type-text-solution',
        state: deserializeTextSolution(
          initialState as TextSolutionSerializedState
        )
      }
    case 'user':
      return {
        plugin: 'type-user',
        state: deserializeUser(initialState as UserSerializedState)
      }
    case 'video':
      return {
        plugin: 'type-video',
        state: deserializeVideo(initialState as VideoSerializedState)
      }
    default:
      console.log(type, initialState)
      return null
  }

  function deserializeApplet(
    state: AppletSerializedState
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
    state: ArticleSerializedState
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
    state: CourseSerializedState
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
    state: CoursePageSerializedState
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
    state: EventSerializedState
  ): StateType.StateDescriptorSerializedType<typeof eventTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeMathPuzzle(
    state: MathPuzzleSerializedState
  ): StateType.StateDescriptorSerializedType<typeof mathPuzzleTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializePage(
    state: PageSerializedState
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
  }: TextExerciseSerializedState): StateType.StateDescriptorSerializedType<
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
    state: TextExerciseGroupSerializedState
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
    state: TextSolutionSerializedState
  ): StateType.StateDescriptorSerializedType<typeof textSolutionTypeState> {
    return {
      ...state,
      content: serializeEditorState(
        toEdtr(deserializeEditorState(state.content))
      )
    }
  }

  function deserializeUser(
    state: UserSerializedState
  ): StateType.StateDescriptorSerializedType<typeof userTypeState> {
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
    return {
      ...state,
      description: serializeEditorState(
        toEdtr(deserializeEditorState(state.description))
      )
    }
  }

  interface AppletSerializedState extends Entity {
    title: string
    content: SerializedEditorState
    meta_description: string
    meta_title: string
    reasoning: SerializedEditorState
    url: string
  }

  interface ArticleSerializedState extends Entity {
    title: string
    content: SerializedEditorState
    reasoning: SerializedEditorState
    meta_title: string
    meta_description: string
  }

  interface CourseSerializedState extends Entity {
    title: string
    content: SerializedEditorState
    reasoning: SerializedEditorState
    meta_description: string
    'course-page': CoursePageSerializedState[]
  }

  interface CoursePageSerializedState extends Entity {
    title: string
    icon?: 'explanation' | 'play' | 'question'
    content: SerializedEditorState
  }

  interface EventSerializedState extends Entity {
    title: string
    content: SerializedEditorState
    meta_description: string
    meta_title: string
  }

  interface MathPuzzleSerializedState extends Entity {
    content: SerializedEditorState
    source: string
  }

  interface PageSerializedState extends Uuid, License {
    title: string
    content: SerializedEditorState
  }

  interface TextExerciseGroupSerializedState extends Entity {
    content: SerializedEditorState
    'grouped-text-exercise': TextExerciseSerializedState[]
  }

  interface TextExerciseSerializedState extends Entity {
    content: SerializedEditorState
    'text-solution': TextSolutionSerializedState
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

  interface TextSolutionSerializedState extends Entity {
    title: string
    content: SerializedEditorState
  }

  interface UserSerializedState extends Uuid {
    description: SerializedEditorState
  }

  interface VideoSerializedState extends Entity {
    title: string
    content: string
    description: SerializedEditorState
    reasoning: SerializedEditorState
  }
}

function toEdtr(content: EditorState): RowsPlugin {
  if (!content) return { plugin: 'rows', state: [] }
  if (isEdtr(content)) return content as RowsPlugin
  return convert(content) as RowsPlugin
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
