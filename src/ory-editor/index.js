import React from 'react'
import ReactDOM from 'react-dom'

import { map } from 'ramda'
import Editor, { Editable, createEmptyState } from 'ory-editor-core'
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

const content = map(
  element => JSON.parse(element.getAttribute('data-raw-content')),
  document.querySelectorAll('.rawData')
)
console.log(content)

const editor = new Editor({
  plugins: EditorPlugins,
  // pass the content state - you can add multiple editables here
  editables: [...content]
})

const elements = document.querySelectorAll('.editable')
let i = 0
for (const element of elements) {
  ReactDOM.render(<Editable editor={editor} id={content[i].id} />, element)
  i++
}

ReactDOM.render(
  <div>
    <Trash editor={editor} />
    <DisplayModeToggle editor={editor} />
    <Toolbar editor={editor} />
  </div>,
  document.getElementById('controls')
)
