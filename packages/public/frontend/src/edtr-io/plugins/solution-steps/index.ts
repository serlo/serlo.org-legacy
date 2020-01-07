import {
  child,
  object,
  list,
  string,
  boolean,
  EditorPluginProps,
  optional
} from '@edtr-io/plugin'

import { SolutionStepsEditor } from './editor'
import { SolutionElementType } from './types'

export type SolutionStepsProps = EditorPluginProps<typeof solutionStepsState>

const stepState = object({
  type: string(SolutionElementType.step),
  isHalf: boolean(),
  content: child({ plugin: 'rows' })
})

export const solutionStepsState = object({
  introduction: child({ plugin: 'text' }),
  strategy: optional(child({ plugin: 'rows' })),
  solutionSteps: list(stepState),
  additionals: optional(child({ plugin: 'rows' }))
})

export const solutionStepsPlugin = {
  Component: SolutionStepsEditor,
  state: solutionStepsState,
  config: {}
}
