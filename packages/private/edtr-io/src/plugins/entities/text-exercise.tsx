import * as React from 'react'
import { StatefulPlugin, StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { legacyOrChild, migrateInteractiveLegacy, standardElements } from './common'

/**
 * {
 *   id: 5459
 *   content: [[ col: 12, content: 'markdown']]
 *   textSolution: { plugin: 'textSolution', state: ....}
 *   singleChoice: ...
 * }
 *
 *
 * {
 *   __version__: 1
 *   value: {
 *   id: 5459,
 *   content: { plugin: 'rows', state: [..., { plugin: 'scMCExercise, state: ....}]}
 *   textSolution: { plugin: 'textSolution', state: ....}
 *   }
 * }
 */

export const textExerciseState = migrateInteractiveLegacy({
  ...standardElements,
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