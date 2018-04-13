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

import Showdown from 'showdown'
import serlocodeprepare from '../editor/editor/showdown/extensions/serlo_code_prepare'
import serloinjections from '../editor/editor/showdown/extensions/injections'
import serloatusername from '../editor/editor/showdown/extensions/at_username'
import serlostrikethrough from '../editor/editor/showdown/extensions/strike_through'
import serlotable from '../editor/editor/showdown/extensions/table'
import serlospoilerprepare from '../editor/editor/showdown/extensions/spoiler_prepare'
import serlospoiler from '../editor/editor/showdown/extensions/spoiler'
import serlohtmlstrip from '../editor/editor/showdown/extensions/html_strip'
import serlolatex from '../editor/editor/showdown/extensions/latex'
import serlolatexoutput from '../editor/editor/showdown/extensions/latex_output'
import serlocodeoutput from '../editor/editor/showdown/extensions/serlo_code_output'

const port = 7072
const host = '127.0.0.1'

// Load custom extensions
Showdown.extension('serloinjections', serloinjections)
Showdown.extension('serlotable', serlotable)
Showdown.extension('serlospoilerprepare', serlospoilerprepare)
Showdown.extension('serlospoiler', serlospoiler)
Showdown.extension('serlolatex', serlolatex)
Showdown.extension('serlolatexoutput', serlolatexoutput)
Showdown.extension('serlohtmlstrip', serlohtmlstrip)
Showdown.extension('serloatusername', serloatusername)
Showdown.extension('serlostrikethrough', serlostrikethrough)
Showdown.extension('serlocodeprepare', serlocodeprepare)
Showdown.extension('serlocodeoutput', serlocodeoutput)

const markdownConverter = new Showdown.Converter({
  extensions: [
    'serlocodeprepare',
    'serloinjections',
    'serloatusername',
    'serlostrikethrough',
    'serlotable',
    'serlospoilerprepare',
    'serlospoiler',
    'serlohtmlstrip',
    'serlolatex',
    'serlolatexoutput',
    'serlocodeoutput'
  ]
})

// **render**
// @param {String} input Json string,
// containing Serlo Flavored Markdown (sfm)
// structured for layout, that should be converted,
// or OryEditor formated JsonState
// @param {Integer} id
// @param {Function} callback
function render (input, id, callback) {
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
      data.id = id
    } catch (e) {
      callback(
        '',
        'InvalidArgumentException',
        'No valid json string given: ' + input
      )
      return
    }
    // console.log("converting...");

    const oryState = data['cells'] ? data : converter(data, id)
    const output = ReactDOMServer.renderToString(<HTMLRenderer state={oryState} plugins={EditorPlugins} />)

//    callback(`<div class="editable" data-id='${id}' data-raw-content='${JSON.stringify(oryState)}'>${output}</div>`)
    callback(`<div data-raw-content='${JSON.stringify(oryState)}'>${output}</div>`)
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
