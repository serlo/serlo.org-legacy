import {
  child,
  EditorPlugin,
  EditorPluginProps,
  list,
  object,
} from '@edtr-io/plugin'
import { useScopedSelector, useScopedStore } from '@edtr-io/core'
import {
  focus,
  getDocument,
  getFocused,
  isEmpty,
  isFocused,
} from '@edtr-io/store'
import React from 'react'
import { useI18n } from '@serlo/i18n'
import { Icon, faTimes, styled } from '@edtr-io/ui'
import * as R from 'ramda'

const tableState = object({
  // TODO: Dont allow headings, bold, italic
  // TODO: Make this inline text (option in slate)
  headers: list(object({ content: child({ plugin: 'text' }) }), 2),
  rows: list(
    object({
      columns: list(object({ content: child({ plugin: 'text' }) }), 2),
    }),
    4
  ),
})

export type SerloTablePluginState = typeof tableState
export type SerloTableProps = EditorPluginProps<SerloTablePluginState>

export const serloTablePlugin: EditorPlugin<SerloTablePluginState> = {
  Component: SerloTableEditor,
  config: {},
  state: tableState,
}

const Table = styled.table({
  borderCollapse: 'collapse',
  width: '100%',
  height: '100%',
  overflowX: 'scroll',
  // TODO: How to unhack
  // (Lösung: Slate so machen, dass es inline gerendert werden kann)
  div: {
    marginBottom: '0px',
  },
})

const TableHeader = styled.th({
  border: '1px solid black',
  minWidth: '8em',
  backgroundColor: '#ddd',
})

const TableCell = styled.td({
  border: '1px solid black',
  height: '1em',
})

// TODO: Can we delete it?
const ImageCell = styled(TableCell)({})

// TODO: Make AddButton of edtr-io stylable
const AddButton = styled.button({
  border: '2px solid lightgrey',
  margin: '3px',
  backgroundColor: 'white',
  textAlign: 'center',
  verticalAlign: 'middle',
  borderRadius: '10px',
  minHeight: '50px',
  color: 'lightgrey',
  fontWeight: 'bold',
  width: '100%',
  '&:hover, &:focused': {
    color: '#007ec1',
    border: '3px solid #007ec1',
  },
})

const AddColumnButton = styled(AddButton)({
  width: '2em',
  height: '100%',
})

// TODO: From edtor-io -> export it there?!
const RemoveButton = styled.button({
  outline: 'none',
  width: '35px',
  border: 'none',
  background: 'transparent',
  color: 'lightgrey',
})

const ConvertLink = styled.a({
  display: 'block',
  marginTop: '1em',
  fontSize: 'smaller',
})

function SerloTableEditor(props: SerloTableProps) {
  const i18n = useI18n()
  const { headers, rows } = props.state
  const store = useScopedStore()

  const focusedElement = useScopedSelector(getFocused())
  const nestedFocus =
    props.focused ||
    headers
      .map((header) => header.content.id as string | null)
      .includes(focusedElement) ||
    rows.some((row) =>
      row.columns
        .map((column) => column.content.id as string | null)
        .includes(focusedElement)
    )

  if (!nestedFocus) return <SerloTableRenderer {...props} />

  return (
    <Table>
      <tbody>
        <tr>
          <td />
          {R.range(0, headers.length).map((column, key) => (
            <td style={{ textAlign: 'center' }} key={key}>
              <RemoveButton
                onClick={() => {
                  if (headers.length === 1) return
                  headers.remove(column)
                  for (const row of rows) {
                    row.columns.remove(column)
                  }
                }}
              >
                <Icon icon={faTimes} />
              </RemoveButton>
            </td>
          ))}
        </tr>
        <tr>
          <td />
          {headers.map(({ content }, column) => (
            <TableHeader key={column}>
              {content.render({ config: { placeholder: '' } })}
            </TableHeader>
          ))}
          <td rowSpan={rows.length + 1} style={{ height: '100%' }}>
            <AddColumnButton
              onClick={() => {
                headers.insert(headers.length, { content: { plugin: 'text' } })

                for (const row of rows) {
                  row.columns.insert(row.columns.length, {
                    content: { plugin: 'text' },
                  })
                }
              }}
            >
              +
            </AddColumnButton>
          </td>
        </tr>
        {rows.map(({ columns }, rowIndex) => (
          <tr key={rowIndex}>
            <td style={{ width: '2em' }}>
              <RemoveButton onClick={() => rows.remove(rowIndex)}>
                <Icon icon={faTimes} />
              </RemoveButton>
            </td>
            {columns.map(({ content }, columnIndex) => {
              const isImage =
                getDocument(content.get())(store.getState())?.plugin === 'image'
              const contentHasFocus = isFocused(content.get())(store.getState())

              return isImage ? (
                <ImageCell
                  key={columnIndex}
                  style={{ width: `${100 / headers.length}%` }}
                >
                  {content.render()}
                  {contentHasFocus && (
                    // TODO: Is there a trick to not use onMouseDown?!
                    <ConvertLink onMouseDown={() => content.replace('text')}>
                      {i18n.t('convert to text')}
                    </ConvertLink>
                  )}
                </ImageCell>
              ) : (
                <TableCell
                  key={columnIndex}
                  onClick={() => store.dispatch(focus(content.get()))}
                >
                  {content.render({ config: { placeholder: '' } })}
                  {contentHasFocus && (
                    <ConvertLink onMouseDown={() => content.replace('image')}>
                      {i18n.t('convert to image')}
                    </ConvertLink>
                  )}
                </TableCell>
              )
            })}
          </tr>
        ))}
        <tr>
          <td />
          <td colSpan={headers.length}>
            <AddButton
              onClick={() =>
                rows.insert(headers.length, {
                  columns: R.range(0, headers.length).map((_) => {
                    return { content: { plugin: 'text' } }
                  }),
                })
              }
            >
              {i18n.t('+ Add row')}
            </AddButton>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

function SerloTableRenderer(props: SerloTableProps) {
  const store = useScopedStore()
  const { headers, rows } = props.state

  return (
    <Table>
      <thead>
        <tr>
          {headers.map(({ content }, column) => (
            <TableHeader key={column}>
              {isEmpty(content.id)(store.getState())
                ? '<Empty>'
                : content.render()}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ columns }, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map(({ content }, columnIndex) => {
              const isImage =
                getDocument(content.get())(store.getState())?.plugin === 'image'

              return isImage ? (
                <ImageCell
                  key={columnIndex}
                  style={{ width: `${100 / headers.length}%` }}
                >
                  {!isEmpty(content.id)(store.getState()) && content.render()}
                </ImageCell>
              ) : (
                <TableCell key={columnIndex}>
                  {!isEmpty(content.id)(store.getState()) && content.render()}
                </TableCell>
              )
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
