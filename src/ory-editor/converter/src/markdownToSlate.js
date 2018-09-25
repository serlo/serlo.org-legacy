import renderMarkdown from './markdownToHtml'

import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'

const renderCell = cell => {
  const { rows = [] } = cell

  if (cell.markdown) {
    return {
      content: {
        plugin: { name: slatePlugin.name, version: slatePlugin.version },
        state: slatePlugin.serialize(
          slatePlugin.unserialize({
            importFromHtml: renderMarkdown(cell.markdown)
          })
        )
      }
    }
  } else if (rows.length > 0) {
    return {
      ...cell,
      rows: rows.map(renderRow)
    }
  }
  return cell
}

const renderRow = row => ({
  ...row,
  cells: row.cells.map(renderCell)
})

const markdownToSlate = input => ({
  ...input,
  cells: input.cells.map(renderCell)
})

export default markdownToSlate
