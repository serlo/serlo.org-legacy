import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { legacyOrChild, licenseState } from './common'

export const textExerciseState = StateType.object({
  id: StateType.number(),
  content: legacyOrChild,
  textSolution: StateType.child('textSolution'),
  // reasoning: legacyOrChild,
  // changes: StateType.string(),
  // metaTitle: StateType.string(),
  // metaDescription: StateType.string(),
  license: licenseState
})

export const textExercisePlugin: StatefulPlugin<typeof textExerciseState> = {
  Component: TextExerciseRenderer,
  state: textExerciseState
}

function TextExerciseRenderer(props: StatefulPluginEditorProps<typeof textExerciseState>) {
  const { content, textSolution, license } = props.state

  return (
    <div>
      { content.render() }
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