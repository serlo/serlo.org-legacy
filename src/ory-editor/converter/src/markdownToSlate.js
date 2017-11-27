/**
 * Created by benny on 24.11.16.
 */
import renderMarkdown from './markdownToHtml'

const renderCell = cell => {
  const { rows = [] } = cell

  if (cell.markdown) {
    return {
      content: {
        plugin: { name: 'ory/editor/core/content/slate' },
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
