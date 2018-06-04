/* Athene2 Editor
 * Serverside Markdown Parser
 *
 * Uses a slightly modified version of showdown.
 *
 * Offers a `render` method via dNode.
 *
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import converter from './converter'
import { HTMLRenderer } from 'ory-editor-renderer'
import EditorPlugins from './plugins'
import dnode from 'dnode'
import base64 from 'base-64'
import utf8 from 'utf8'

const port = 7072
const host = '127.0.0.1'

// **render**
// @param {String} input Json string,
// containing Serlo Flavored Markdown (sfm)
// structured for layout, that should be converted,
// or OryEditor formated JsonState
// @param {Function} callback
function render (input, callback) {
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
    const output = ReactDOMServer.renderToString(
      <HTMLRenderer state={oryState} plugins={EditorPlugins} />
    )

    callback(
      `<div class="ory-content" data-raw-content='${base64.encode(
        utf8.encode(JSON.stringify(oryState))
      )}'>${output}</div>`
    )
  }
}

const server = dnode(
  function (remote, connection) {
    // Populate `render` function for
    // dnode clients.
    this.render = render
  },
  {
    weak: false
  }
)

server.listen(port)
