/**
 * Created by benny on 24.11.16.
 */

import showdown from 'showdown'

const renderMarkdown = input => {
  const converter = new showdown.Converter()
  let html = converter.makeHtml(input)
  html = html.replace(/"/gm, '"')
  return html
    .replace(/%%(.*?)%%/gm, '<katexinline>$1</katexinline>')
    .replace(/\$\$(.*?)\$\$/gm, '<katexblock>$1</katexblock>')
}
export default renderMarkdown
