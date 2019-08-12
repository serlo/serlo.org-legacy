import { StateType } from '@edtr-io/core'
import { convert, Legacy, Splish } from '@serlo/legacy-editor-to-editor'
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
// import { inputExerciseState } from '@edtr-io/plugin-input-exercise'

const legacy = StateType.scalar<Legacy|Splish>([[ {col: 24, content:''} ]])

export const legacyOrChild = StateType.migratable(legacy).migrate(StateType.child(),a => {
  return a ? convert(a) : { plugin: "rows", state: [{plugin: 'text'}]}
})

export const licenseState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  url: StateType.string(),
  agreement: StateType.string(),
  iconHref: StateType.string()
})

export const standardElements = {
  id: StateType.number(),
  license: licenseState,
  // changes: StateType.string(),
}

const scMcLegacy = {
  singleChoiceRightAnswer: StateType.scalar<{ content: Legacy, feedback: Legacy } | undefined>(undefined),
  singleChoiceWrongAnswer: StateType.scalar<{ content: Legacy, feedback: Legacy }[] | undefined>(undefined),
  multipleChoiceRightAnswer: StateType.scalar<{ content: Legacy }[] | undefined>(undefined),
  multipleChoiceWrongAnswer: StateType.scalar<{ content: Legacy, feedback: Legacy }[] | undefined>(undefined)
}

// TODO: nested input
// const inputState = StateType.object({
//   solution: StateType.string(),
//   feedback: legacyOrChild
// })
// const inputExerciseLegacy = {
//   inputExpressionEqualMatchChallenge: inputState,
//   inputStringNormalizedMatchChallenge: inputState,
//   inputNumberExactMatchChallenge: inputState,
// }

export function migrateInteractiveLegacy<Ds extends Record<string, StateType.StateDescriptor>>(types: Ds) {
  return StateType.migratable(StateType.object({
    ...types,
    ...scMcLegacy,
    // ...inputExerciseLegacy
  })).migrate(
    StateType.object({
      ...types,
    scMcExercise: StateType.child('scMcExercise'),
    // inputExercise: StateType.child('inputExercise')
  }),
    ({
       singleChoiceWrongAnswer,
       singleChoiceRightAnswer,
       multipleChoiceWrongAnswer,
       multipleChoiceRightAnswer,
       // inputExpressionEqualMatchChallenge,
       // inputNumberExactMatchChallenge,
       // inputStringNormalizedMatchChallenge,
       ...state
     }) => {
      const scMcExercise = convertScMc({ singleChoiceWrongAnswer, singleChoiceRightAnswer, multipleChoiceWrongAnswer, multipleChoiceRightAnswer })
      // const inputExercise = convertInputExercise({ inputExpressionEqualMatchChallenge, inputNumberExactMatchChallenge, inputStringNormalizedMatchChallenge })
      console.log('common', JSON.stringify(scMcExercise))
      return {
        ...state as StateType.StateDescriptorsSerializedType<Ds>,
        scMcExercise: scMcExercise || { plugin: 'scMcExercise' },
        // inputExercise
      }
  })
}

export function convertScMc({
  singleChoiceWrongAnswer,
  singleChoiceRightAnswer,
  multipleChoiceWrongAnswer,
  multipleChoiceRightAnswer
} : StateType.StateDescriptorsSerializedType<typeof scMcLegacy>)
: { plugin: 'scMcExercise', state: StateType.StateDescriptorSerializedType<typeof scMcExerciseState>} | undefined {
  if (singleChoiceWrongAnswer || singleChoiceRightAnswer || multipleChoiceWrongAnswer || multipleChoiceRightAnswer) {
    const isSingleChoice = !(multipleChoiceRightAnswer || multipleChoiceWrongAnswer)
    return {
        plugin: 'scMcExercise',
        state: {
          isSingleChoice: isSingleChoice,
          answers: [
            ...(singleChoiceRightAnswer ? [{
              id: convert(singleChoiceRightAnswer.content),
              isCorrect: true,
              feedback: convert(singleChoiceRightAnswer.feedback),
              hasFeedback: !!singleChoiceRightAnswer.feedback
            }] : []),
            ...(singleChoiceWrongAnswer ? singleChoiceWrongAnswer.map(answer => {
              return {
                id: convert(answer.content),
                isCorrect: false,
                feedback: convert(answer.feedback),
                hasFeedback: !!answer.feedback
              }
            }) : []),
            ...(multipleChoiceRightAnswer ? multipleChoiceRightAnswer.map(answer => {
              return {
                id: convert(answer.content),
                isCorrect: true,
                feedback: { plugin: 'rows', state: [{plugin: 'text'}] },
                hasFeedback: false
              }
            }) : []),
            ...(multipleChoiceWrongAnswer ? multipleChoiceWrongAnswer.map(answer => {
              return {
                id: convert(answer.content),
                isCorrect: false,
                feedback: convert(answer.feedback),
                hasFeedback: !!answer.feedback,
              }
            }) : [])
          ]
        }
      }
  }
}
