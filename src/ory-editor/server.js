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

const port = 7071
const host = '127.0.0.1'

// Load custom extensions
Showdown.extensions.serloinjections = serloinjections
Showdown.extensions.serlotable = serlotable
Showdown.extensions.serlospoilerprepare = serlospoilerprepare
Showdown.extensions.serlospoiler = serlospoiler
Showdown.extensions.serlolatex = serlolatex
Showdown.extensions.serlolatexoutput = serlolatexoutput
Showdown.extensions.serlohtmlstrip = serlohtmlstrip
Showdown.extensions.serloatusername = serloatusername
Showdown.extensions.serlostrikethrough = serlostrikethrough
Showdown.extensions.serlocodeprepare = serlocodeprepare
Showdown.extensions.serlocodeoutput = serlocodeoutput

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

function convert (input, callback) {
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
    render(JSON.stringify(oryState), callback)
  }
}
// **render**
// @param {String} input Json string,
// containing Serlo Flavored Markdown (sfm)
// structured for layout.
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
    // console.log("converting...");

    if (data['cells']) {
      const oryState = data
      const output = ReactDOMServer.renderToString(
        <div className={'editable'} data-raw-content={JSON.stringify(oryState)}>
          <HTMLRenderer state={oryState} plugins={EditorPlugins} />
        </div>
      )

      callback(output)
    } else {
      let output = ''

      for (let i = 0, l = data.length; i < l; i++) {
        let row = data[i];
        output += '<div class="r">';
        for (let j = 0, lj = row.length; j < lj; j++
        ) {
          let column = row[j];
          output += '<div class="c' + column.col + '">'
          output += markdownConverter.makeHtml(column.content)
          output += '</div>'
        }
        output += '</div>'
      }
      callback(output)
    }
  }
}

const server = dnode(
  function (remote, connection) {
    // Populate `render` function for
    // dnode clients.
    this.render = render
    this.convert = convert
  },
  {
    weak: false
  }
)

server.listen(port)
