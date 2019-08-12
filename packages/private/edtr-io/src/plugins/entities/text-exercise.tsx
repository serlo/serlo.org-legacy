import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { standardElements } from './common'

export const textExerciseState = StateType.object({
  ...standardElements,
  content: StateType.child('rows'),
  textSolution: StateType.child('textSolution'),
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