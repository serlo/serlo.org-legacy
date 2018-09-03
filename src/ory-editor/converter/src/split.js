import normalizeMarkdown from './normalizeMarkdown'
import createPlugins from './createPlugin'

const splitMarkdown = markdown => createPlugins(normalizeMarkdown(markdown))

const splitCell = cell => {
  if (typeof cell.raw !== 'undefined') {
    return {
      size: cell.size,
      rows: splitMarkdown(cell.raw)
    }
  } else {
    const { rows = [] } = cell
    return {
      ...cell,
      rows: rows.map(splitRow)
    }
  }
}

const splitRow = row => ({
  ...row,
  cells: row.cells.map(splitCell)
})

const split = input => ({
  ...input,
  cells: input.cells.map(splitCell)
})

export default split
