import React from 'react'
import { renderToString } from 'react-dom/server'
import converter from './converter'
import { HtmlRenderer } from '@splish-me/editor-core/lib/html-renderer.component'
import createEditorPlugins from './plugins'
import base64 from 'base-64'
import utf8 from 'utf8'

export function render (input, callback) {
  let data

  // callback(output, Exception, ErrorMessage);
  if (input === undefined) {
    callback('', 'InvalidArgumentException', 'No input given')
    return
  }

  if (input === '') {
    callback('')
  } else {
    // parse input to object
    try {
      input = input.trim().replace(/&quot;/g, '"')
      data = JSON.parse(input)
    } catch (e) {
      callback(
        '',
        'InvalidArgumentException',
        'No valid json string given: ' + input
      )
      return
    }
    const oryState = data['cells'] ? data : converter(data)

    console.log('------------------------------------')
    console.log(JSON.stringify({ state: JSON.stringify(oryState)}))
    console.log('------------------------------------')

    const output = renderToString(
      <HtmlRenderer state={oryState} plugins={createEditorPlugins()} />
    )

    callback(
      `<div class="ory-content" data-raw-content='${base64.encode(
        utf8.encode(JSON.stringify(oryState))
      )}'>${output}</div>`
    )
  }
}
