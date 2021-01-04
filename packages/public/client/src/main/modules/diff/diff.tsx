/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as React from 'react'
import { render } from 'react-dom'
import { convert, isEdtr } from '@serlo/legacy-editor-to-editor'
import { cleanEdtrState } from '@serlo/edtr-io'
import styled from 'styled-components'
import $ from 'jquery'

//@ts-ignore
import t from '../../../modules/translator'

export function initDiff() {
  const $elements = $('.revision-compare')
  if (!$elements.length) return

  import('./helper').then(({ createPatch, Diff2Html }) => {
    $elements.each((_index, el) => {
      const title = $(el).data('field-name')
      const $old = $('.revision-compare-old', el)
      const $new = $('.revision-compare-new', el)
      const diff = createPatch(title, ...prettify($old.text(), $new.text()))
      const html = Diff2Html.getPrettyHtml(diff, {
        inputFormat: 'diff',
        showFiles: false,
        matching: 'lines',
        maxLineSizeInBlockForComparison: 1000,
        rawTemplates: {
          'line-by-line-file-diff': `
<div class="d2h-file-diff">
    <div class="d2h-code-wrapper">
        <table class="d2h-diff-table">
            <tbody class="d2h-diff-tbody">
            {{{diffs}}}
            </tbody>
        </table>
    </div>
</div>
`,
          'generic-empty-diff': `
<tr>
    <td class="{{diffParser.LINE_TYPE.INFO}}">
        <div class="{{contentClass}} {{diffParser.LINE_TYPE.INFO}}">
            Keine Änderungen
        </div>
    </td>
</tr>`,
        },
      })

      const sideBySideHtml = Diff2Html.getPrettyHtml(diff, {
        inputFormat: 'diff',
        showFiles: false,
        matching: 'lines',
        maxLineSizeInBlockForComparison: 1000,
        outputFormat: 'side-by-side',
      })
      const modal = $('<div>').attr('id', `side-by-side-${title}`)
      $(el).append(modal)
      render(<SideBySide diffHtml={sideBySideHtml} />, modal.get(0))
      $(el).append(html)
    })
  })
}

const Wrapper = styled.div({
  textAlign: 'right',
})
const Modal = styled.div({
  position: 'fixed',
  top: '0',
  left: '0',
  backgroundColor: 'rgba(100,100,100,0.6)',
  zIndex: 1000,
  width: '100%',
  height: '100%',
})
const ModalInner = styled.div({
  backgroundColor: '#fff',
  position: 'relative',
  margin: '5%',
  padding: '20px',
  width: '90%',
  height: '90%',
  overflow: 'scroll',
})
function SideBySide(props: { diffHtml: string }) {
  const [open, setOpen] = React.useState(false)

  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!ref.current) return

    $(ref.current)
      .find('.d2h-file-side-diff')
      .on('scroll', function () {
        const $this = $(this)
        const scrollPosition = $this.scrollLeft()
        if (scrollPosition) {
          $this
            .closest('.d2h-file-wrapper')
            .find('.d2h-file-side-diff')
            .scrollLeft(scrollPosition)
        }
      })
  }, [open])
  return (
    <Wrapper>
      {open ? (
        <Modal>
          <ModalInner>
            <a
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </a>
            <div
              ref={ref}
              dangerouslySetInnerHTML={{ __html: props.diffHtml }}
            />
            <a
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </a>
          </ModalInner>
        </Modal>
      ) : (
        <a
          onClick={() => {
            setOpen(true)
          }}
        >
          {t('Show changes side by side')}
        </a>
      )}
    </Wrapper>
  )
}

function prettify(
  oldStringified: string,
  newStringified: string
): [string, string] {
  try {
    const parsed = JSON.parse(oldStringified.trim())
    const parsedNew = JSON.parse(newStringified.trim())
    if (isEdtr(parsedNew)) {
      const oldEdtr = isEdtr(parsed) ? parsed : convert(parsed)
      return [
        JSON.stringify(cleanEdtrState(oldEdtr), null, 1),
        JSON.stringify(cleanEdtrState(parsedNew), null, 1),
      ]
    }
    return [JSON.stringify(parsed, null, 2), JSON.stringify(parsedNew, null, 1)]
  } catch (e) {
    // was no json.
    return [oldStringified.trim(), newStringified.trim()]
  }
}
