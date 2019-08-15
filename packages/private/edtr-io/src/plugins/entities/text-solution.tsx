import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { editorContent, standardElements } from './common'

export const textSolutionState = StateType.object({
  ...standardElements,
  title: StateType.string(),
  content: editorContent()
})

export const textSolutionPlugin: StatefulPlugin<typeof textSolutionState> = {
  Component: TextSolutionRenderer,
  state: textSolutionState
}

function TextSolutionRenderer(props: StatefulPluginEditorProps<typeof textSolutionState>) {
  return <solutionPlugin.Component {...props}/>
}