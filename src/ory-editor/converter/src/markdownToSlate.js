import renderMarkdown from './markdownToHtml'
import createSlate from '@splish-me/editor-plugin-slate'

const slate = createSlate()

const renderCell = cell => {
  const { rows = [] } = cell

  if (cell.markdown) {
    return {
      content: {
        plugin: { name: slate.name, version: slate.version },
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
