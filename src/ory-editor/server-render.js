import { HtmlRenderer } from '@serlo-org/html-renderer'
import PluginService from '@splish-me/ory-editor-core/lib/service/plugin'
import base64 from 'base-64'
import React from 'react'
import { renderToString } from 'react-dom/server'
import utf8 from 'utf8'

import converter from './converter'
import createEditorPlugins from './plugins';
import createRenderPlugins from './plugins.render';


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

    const plugins = new PluginService({
      content: createEditorPlugins()
    })
    const oryState = data['cells'] ? data : (plugins.serialize(plugins.unserialize(converter(data))))

    const output = renderToString(
      <HtmlRenderer state={oryState} plugins={createRenderPlugins()} />
    )

    callback(
      `<div class="ory-content" data-raw-content='${base64.encode(
        utf8.encode(JSON.stringify(oryState))
      )}'>${output}</div>`
    )
  }
}
