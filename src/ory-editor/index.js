import React from 'react'
import ReactDOM from 'react-dom'

import { map, zipWith } from 'ramda'
import Editor, { Editable, createEmptyState } from 'ory-editor-core'
import { HTMLRenderer } from 'ory-editor-renderer'
import 'ory-editor-core/lib/index.css' // we also want to load the stylesheets

import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'

// Load some exemplary plugins:
import EditorPlugins from './plugins'
import 'ory-editor-plugins-slate/lib/index.css' // Stylesheets for the rich text area plugin
import 'ory-editor-plugins-image/lib/index.css'
import 'ory-editor-plugins-parallax-background/lib/index.css' // Stylesheets for parallax background images
import 'ory-editor-plugins-spacer/lib/index.css'
import 'ory-editor-plugins-divider/lib/index.css'
import 'ory-editor-plugins-video/lib/index.css'

import 'katex/dist/katex.min.css'

require('react-tap-event-plugin')() // react-tap-event-plugin is required by material-ui which is used by ory-editor-ui so we need to call it here

const elements = document.querySelectorAll('.editable')
const contents = map(element => JSON.parse(element.getAttribute('data-raw-content')), elements)

zipWith((element, content) => {
  ReactDOM.render(
    <div className={'editable'} data-raw-content={JSON.stringify(content)}>
      <HTMLRenderer state={content} plugins={EditorPlugins} />
    </div>, element)
}, elements, contents)

const loadEditor = () => {
  const editor = new Editor({
    plugins: EditorPlugins,
    editables: [...contents]
  })
  editor.trigger.mode.edit()

  zipWith((element, content) => {
    ReactDOM.render(<Editable editor={editor} id={content.id} />, element)
  }, elements, contents)

  ReactDOM.render(
    <div>
      <Trash editor={editor} />
      <DisplayModeToggle editor={editor} />
      <Toolbar editor={editor} />
    </div>,
    document.getElementById('controls')
  )
}

export default loadEditor
