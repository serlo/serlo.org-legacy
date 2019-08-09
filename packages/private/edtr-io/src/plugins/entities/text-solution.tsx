import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { standardElements, legacyOrChild, licenseState } from './common'

const textSolutionState = StateType.object({
  ...standardElements,
  title: StateType.string(),
  content: legacyOrChild
})

export const textSolutionPlugin: StatefulPlugin<typeof textSolutionState> = {
  Component: TextSolutionRenderer,
  state: textSolutionState
}

function TextSolutionRenderer(props: StatefulPluginEditorProps<typeof textSolutionState>) {
  return <solutionPlugin.Component {...props}/>
}