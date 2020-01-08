import {
  child,
  object,
  string,
  EditorPlugin,
  EditorPluginProps,
  list
} from '@edtr-io/plugin'

import { SolutionEditor } from './editor'

const solutionState = object({
  title: string(''),
  content: list(child({ plugin: 'solutionSteps' }))
})
export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export function createSolutionPlugin(): EditorPlugin<SolutionState> {
  return {
    Component: SolutionEditor,
    config: {},
    state: solutionState
  }
}
