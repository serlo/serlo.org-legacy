import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { legacyOrChild, migrateInteractiveLegacy, standardElements } from './common'

export const textExerciseState = migrateInteractiveLegacy({
  ...standardElements,
  content: legacyOrChild,
  textSolution: StateType.child('textSolution'),
  // reasoning: legacyOrChild,
  // changes: StateType.string(),
  // metaTitle: StateType.string(),
  // metaDescription: StateType.string(),
})

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