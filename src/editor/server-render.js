import { HtmlRenderer } from '@serlo-org/html-renderer'
import React from 'react'
import { renderToString } from 'react-dom/server'

import converter from './converter'
import createRenderPlugins from './plugins.render'
import { stringifyState } from './helpers'

const wrapOutput = ({ state, children }) => {
  return `<div class="ory-content" data-raw-content='${stringifyState(
    state
  )}'>${children || ''}</div>`
}

export function render(input, callback) {
  let data

  // callback(output, Exception, ErrorMessage);
  if (typeof input === 'undefined') {
    callback('', 'InvalidArgumentException', 'No input given')
    return
  }

  if (input === '') {
    callback('')
  } else {
    // parse input to object
    try {
      // FIXME:
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

    const state = data['cells'] ? data : converter(data)

    try {
      const children = renderToString(
        <HtmlRenderer
          state={state}
          plugins={createRenderPlugins('text-exercise')}
        />
      )

      callback(wrapOutput({ state, children }))
    } catch (e) {
      callback(wrapOutput({ state }))
    }
  }
}
