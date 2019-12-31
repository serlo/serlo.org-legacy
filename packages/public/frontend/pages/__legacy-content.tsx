import * as React from 'react'
import { converter } from '../src/legacy/markdown'
import { handleBody } from './_document'

function render(state: string) {
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
      const innerHtml = row
        .map(column => {
          return `<div class="c${column.col}">${converter.makeHtml(
            column.content
          )}</div>`
        })
        .join('')

      return `<div class="r">${innerHtml}</div>`
    })
    .join('')
}

export default function Index(props) {
  const html = render(props.input)

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, {
    input: ''
  })
}
