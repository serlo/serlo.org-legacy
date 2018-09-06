import Showdown from 'showdown'
import latexOutput from "../../../editor/editor/showdown/extensions/latex_output";
import htmlStrip from "../../../editor/editor/showdown/extensions/html_strip";
import codePrepare from "../../../editor/editor/showdown/extensions/serlo_code_prepare";
import atUsername from "../../../editor/editor/showdown/extensions/at_username";
import strikeThrough from "../../../editor/editor/showdown/extensions/strike_through";
import latex from "../../../editor/editor/showdown/extensions/latex";
import codeOutput from "../../../editor/editor/showdown/extensions/serlo_code_output";

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
  console.log(html)
  html = html.replace(/"/gm, '"')
  return html
    .replace(/<span class="mathInline">%%(.*?)%%<\/span>/gm, '<katexinline>$1</katexinline>')
    .replace(/<span class="math">\$\$(.*?)\$\$<\/span>/gm, '<katexblock>$1</katexblock>')
}
export default renderMarkdown
