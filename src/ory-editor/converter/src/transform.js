const getCellsFromRow = row =>
  row.map(cell => ({
    size: Math.floor(cell.col / 2),
    raw: cell.content
  }))

const transform = input => ({
  cells: [
    {
      rows: input.map(row => ({
        cells: getCellsFromRow(row)
      }))
    }
  ]
})

export default transform
