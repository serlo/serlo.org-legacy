import renderMarkdown from './markdownToHtml'

import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'

const markdownToSlate = markdown => ({
  content: {
    plugin: { name: slatePlugin.name, version: slatePlugin.version },
    state: slatePlugin.serialize(
      slatePlugin.unserialize({
        importFromHtml: renderMarkdown(markdown)
      })
    )
  }
})
export default markdownToSlate
