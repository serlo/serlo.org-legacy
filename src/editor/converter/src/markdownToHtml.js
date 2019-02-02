/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
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
