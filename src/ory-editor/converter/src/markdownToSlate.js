import renderMarkdown from './markdownToHtml'

const slate = require('@splish-me/editor-plugin-slate/package.json')

const renderCell = cell => {
  const { rows = [] } = cell

  if (cell.markdown) {
    return {
      content: {
        plugin: { name: '@splish-me/slate', version: slate.version },
        state: {
          importFromHtml: renderMarkdown(cell.markdown)
        }
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
