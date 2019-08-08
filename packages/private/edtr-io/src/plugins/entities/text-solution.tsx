import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { legacyOrChild, licenseState } from './common'

const textSolutionState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  content: legacyOrChild,
  // changes: StateType.string(),
  license: licenseState
})

export const textSolutionPlugin: StatefulPlugin<typeof textSolutionState> = {
  Component: TextSolutionRenderer,
  state: textSolutionState
}

function TextSolutionRenderer(props: StatefulPluginEditorProps<typeof textSolutionState>) {
  return (
    <div>
      <solutionPlugin.Component {...props}/>
    </div>
  )
}