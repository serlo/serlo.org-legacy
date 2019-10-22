import $ from 'jquery'
import { convert, isEdtr } from '@serlo/legacy-editor-to-editor'
import { cleanEdtrState } from '@serlo/edtr-io'

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
</tr>`
        }
      })
      $(el).append(html)
    })
  })
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
        JSON.stringify(cleanEdtrState(oldEdtr), null, ' '),
        JSON.stringify(cleanEdtrState(parsedNew), null, ' ')
      ]
    }

    return [
      JSON.stringify(parsed, null, ' '),
      JSON.stringify(parsedNew, null, ' ')
    ]
  } catch (e) {
    // was no json.
  }

  return [oldStringified.trim(), newStringified.trim()]
}
