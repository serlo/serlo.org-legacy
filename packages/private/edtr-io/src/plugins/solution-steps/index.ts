import {
  child,
  object,
  list,
  string,
  boolean,
  EditorPluginProps
} from '@edtr-io/plugin'

import { SolutionStepsEditor } from './editor'

export type SolutionStepsProps = EditorPluginProps<typeof solutionStepsState>

interface Component {
  options: Parameters<typeof child>
  guideline: React.ReactNode
  placeholder: string
}
export interface Config {
  introduction: Component
  strategy: Component
  step: Component
  explanation: Component
  additionals: Component
}

const stepState = object({
  type: string('step'),
  isHalf: boolean(),
  content: child({ plugin: 'rows' })
})

export const solutionStepsState = object({
  introduction: child({ plugin: 'text' }),
  strategy: child({ plugin: 'rows' }),
  hasStrategy: boolean(),
  solutionSteps: list(stepState),
  additionals: child({ plugin: 'rows' }),
  hasAdditionals: boolean()
})

export const solutionStepsPlugin = {
  Component: SolutionStepsEditor,
  state: solutionStepsState,
  config: {}
}
