import Showdown from 'showdown'
import latexOutput from '../../../legacy-editor/editor/showdown/extensions/latex_output'
import htmlStrip from '../../../legacy-editor/editor/showdown/extensions/html_strip'
import codePrepare from '../../../legacy-editor/editor/showdown/extensions/serlo_code_prepare'
import atUsername from '../../../legacy-editor/editor/showdown/extensions/at_username'
import strikeThrough from '../../../legacy-editor/editor/showdown/extensions/strike_through'
import latex from '../../../legacy-editor/editor/showdown/extensions/latex'
import codeOutput from '../../../legacy-editor/editor/showdown/extensions/serlo_code_output'

const converter = new Showdown.Converter({
  extensions: [
    codePrepare,
    htmlStrip,
    latex,
    atUsername,
    strikeThrough,
    latexOutput,
    codeOutput
  ]
})

const renderMarkdown = input => {
  let html = converter.makeHtml(input)
  html = html.replace(/"/gm, '"')
  return html
    .replace(
      /<span class="mathInline">%%(.*?)%%<\/span>/gm,
      '<katexinline>$1</katexinline>'
    )
    .replace(
      /<span class="math">\$\$(.*?)\$\$<\/span>/gm,
      '<katexblock>$1</katexblock>'
    )
    .replace(/\r?\n/gm, '')
}
export default renderMarkdown
