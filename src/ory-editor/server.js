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

const port = 7071
const host = '127.0.0.1'

// **render**
// @param {String} input Json string,
// containing Serlo Flavored Markdown (sfm)
// structured for layout.
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
    // console.log("converting...");
    const oryState = converter(data)
    const output = ReactDOMServer.renderToString(
      <div className={'rawData'} data-raw-content={JSON.stringify(oryState)}>
        <HTMLRenderer state={oryState} plugins={EditorPlugins} />
      </div>
    )

    callback(output)
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
