import {
  child,
  object,
  list,
  string,
  EditorPluginProps,
  optional
} from '@edtr-io/plugin'

import { SolutionStepsEditor } from './editor'

export type ArticlePorps = EditorPluginProps<typeof articleState>

export const articleState = object({
  introduction: child({ plugin: 'text' }),
  explanation: child({ plugin: 'rows' }),
  example: optional(child({ plugin: 'injection' })),
  exerciseFolder: optional(string()),
  courseLink: optional(string()),
  video: optional(child({ plugin: 'injection' })),
  extra: optional(child({ plugin: 'spoiler' })),
  sources: optional(list(string()))
})

export const articlePlugin = {
  Component: SolutionStepsEditor,
  state: articleState,
  config: {}
}
