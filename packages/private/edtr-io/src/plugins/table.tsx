import * as React from 'react'
import { createTablePlugin } from '@edtr-io/plugin-table'
import { converter } from '@serlo/markdown'
import { StatefulPlugin, StatefulPluginEditorProps } from '@edtr-io/core'
import { typeset } from '@serlo/serlo-org-client/src/modules/mathjax'

const edtrTablePlugin = createTablePlugin({
  renderMarkdown: content => converter.makeHtml(content)
})

export const tablePlugin: StatefulPlugin<typeof edtrTablePlugin.state> = {
  ...edtrTablePlugin,
  Component: TableEditor
}

function TableEditor(
  props: StatefulPluginEditorProps<typeof edtrTablePlugin.state>
) {
  const ref = React.createRef<HTMLDivElement>()
  React.useEffect(() => {
    const timeout = setTimeout(typesetMathjax, 1000)
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  })
  return (
    <div ref={ref}>
      <edtrTablePlugin.Component {...props} />
    </div>
  )

  function typesetMathjax() {
    if (!ref.current) {
      return
    }
    typeset(ref.current)
  }
}
