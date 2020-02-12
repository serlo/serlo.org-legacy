import {
  child,
  object,
  list,
  string,
  EditorPluginProps,
  optional
} from '@edtr-io/plugin'

import { SemanticArticleEditor } from './editor'

export type SemanticArticlePorps = EditorPluginProps<typeof articleState>
//todo: (introduction)switch between text and multimedia plugin, (exercise folder)fixed text plus url,source plugin, related content plugin
export const articleState = object({
  introduction: child({ plugin: 'text' }),
  explanation: child({ plugin: 'rows' }),
  example: optional(child({ plugin: 'injection' })),
  exerciseFolder: string(),
  extra: optional(child({ plugin: 'spoiler' })),
  sources: list(string()),
  relatedContent: list(string()),
  videoUrl: optional(child({ plugin: 'video' }))
})

export const semanticArticlePlugin = {
  Component: SemanticArticleEditor,
  state: articleState,
  config: {}
}
