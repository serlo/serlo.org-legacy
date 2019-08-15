import * as React from 'react'
import { ScopeContext, StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { editorContent, standardElements, SaveButton, serializedChild } from './common'

export const textExerciseState = StateType.object({
  ...standardElements,
  content: editorContent(),
  'text-solution': serializedChild('textSolution'),
})

export const textExercisePlugin: StatefulPlugin<typeof textExerciseState> = {
  Component: TextExerciseRenderer,
  state: textExerciseState
}

function TextExerciseRenderer(props: StatefulPluginEditorProps<typeof textExerciseState>) {
  const { content, 'text-solution': textSolution, license } = props.state

  const { scope } = React.useContext(ScopeContext)
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
      <SaveButton scope={scope} />
    </div>
  )
}