import { converter } from '@serlo/markdown'

export async function render(state: string): Promise<string> {
  if (state === undefined) {
    throw new Error('No input given')
  }

  if (state === '') {
    return ''
  }

  let rows: Array<Array<{ col: string; content: string }>>
  try {
    rows = JSON.parse(state.trim().replace(/&quot;/g, '"'))
  } catch (e) {
    throw new Error('No valid json string given')
  }

  return rows
    .map(row => {
      const innerHtml = row.map(column => {
        return `$<div class="c${column.col}">${converter.makeHtml(
          column.content
        )}</div>`
      })

      return `<div class="r">${innerHtml}</div>`
    })
    .join('')
}
