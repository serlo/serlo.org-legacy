/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { StatefulPlugin, StatefulPluginEditorProps } from '@edtr-io/plugin'
import { createTablePlugin } from '@edtr-io/plugin-table'
import { converter } from '../../legacy/markdown'
import { typeset } from '@serlo/mathjax'
import * as React from 'react'

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
  const ref = React.useRef<HTMLDivElement>(null)
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
