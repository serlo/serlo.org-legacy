import {
  child,
  object,
  list,
  string,
  boolean,
  EditorPluginProps,
  optional,
  migratable
} from '@edtr-io/plugin'

import { SolutionStepsEditor } from './editor'
import { SolutionElementType } from './types'

export type SolutionStepsProps = EditorPluginProps<typeof solutionStepsState>

const stepState = object({
  type: string(SolutionElementType.step),
  isHalf: boolean(),
  content: child({ plugin: 'rows' })
})

const solutionStepsState_v0 = object({
  introduction: child({ plugin: 'text' }),
  strategy: optional(child({ plugin: 'rows' })),
  solutionSteps: list(stepState),
  additionals: optional(child({ plugin: 'rows' }))
})
const solutionStepsState_v1 = object({
  introduction: child({ plugin: 'rows' }),
  strategy: optional(child({ plugin: 'rows' })),
  solutionSteps: list(stepState),
  additionals: optional(child({ plugin: 'rows' }))
})

export const solutionStepsState = migratable(solutionStepsState_v0).migrate(
  solutionStepsState_v1,
  previousState => {
    return {
      introduction: { plugin: 'rows', state: [previousState.introduction] } as {
        plugin: 'rows'
        state?: unknown
      },
      strategy: previousState.strategy,
      solutionSteps: previousState.solutionSteps,
      additionals: previousState.additionals
    }
  }
)

export const solutionStepsPlugin = {
  Component: SolutionStepsEditor,
  state: solutionStepsState,
  config: {}
}
