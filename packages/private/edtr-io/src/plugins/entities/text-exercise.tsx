import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { convertScMc, legacyOrChild, licenseState, migrateInteractiveLegacy, standardElements } from './common'

export const textExerciseState : typeof a = migrateInteractiveLegacy({
  ...standardElements,
  content: legacyOrChild,
  textSolution: StateType.child('textSolution'),
  // reasoning: legacyOrChild,
  // changes: StateType.string(),
  // metaTitle: StateType.string(),
  // metaDescription: StateType.string(),
})

const a = StateType.object({
  id: StateType.number(),
  content: legacyOrChild,
  license: licenseState,
  textSolution: StateType.child('textSolution'),
  scMcExercise: StateType.child('scMcExercise'),
  // inputExercise: StateType.child('inputExercise')
})
// export const textExerciseState = StateType.migratable(StateType.object({
//   id: StateType.number(),
//   content: legacyOrChild,
//   license: licenseState,
//   singleChoiceWrongAnswer: StateType.list(StateType.object({
//     content: legacyOrChild,
//     feedback: legacyOrChild
//   })),
//   singleChoiceRightAnswer: StateType.object({
//     content: legacyOrChild,
//     feedback: legacyOrChild
//   }),
// })).migrate(a ,
//   ({
//      singleChoiceWrongAnswer,
//      singleChoiceRightAnswer,
//      // multipleChoiceWrongAnswer,
//      // multipleChoiceRightAnswer,
//      // inputExpressionEqualMatchChallenge,
//      // inputNumberExactMatchChallenge,
//      // inputStringNormalizedMatchChallenge,
//      ...state
//    }) => {
//     const scMcExercise = convertScMc({ singleChoiceWrongAnswer, singleChoiceRightAnswer/*, multipleChoiceWrongAnswer, multipleChoiceRightAnswer*/})
//     // const inputExercise = convertInputExercise({ })
//     console.log('common', scMcExercise)
//     return {
//       ...state,
//       scMcExercise: scMcExercise || { plugin: 'scMcExercise' },
//       // inputExercise
//     }
//   })

export const textExercisePlugin: StatefulPlugin<typeof textExerciseState> = {
  Component: TextExerciseRenderer,
  state: textExerciseState
}

function TextExerciseRenderer(props: StatefulPluginEditorProps<typeof textExerciseState>) {
  const { content, textSolution, license, scMcExercise } = props.state

  return (
    <div>
      { content.render() }
      { scMcExercise.render() }
      <div>
        { textSolution.render() }
      </div>
      <div>
        <img src={license.iconHref.value} />
        { license.title.value }
      </div>
    </div>
  )
}