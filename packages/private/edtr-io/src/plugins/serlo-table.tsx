import {
  child,
  EditorPlugin,
  EditorPluginProps,
  list,
  object,
} from '@edtr-io/plugin'
import { useScopedSelector, useScopedStore } from '@edtr-io/core'
import { getFocused, isEmpty } from '@edtr-io/store'
import React from 'react'
import { useI18n } from '@serlo/i18n'
import { Icon, faTimes, styled } from '@edtr-io/ui'
import * as R from 'ramda'

const tableState = object({
  headers: list(object({ content: child({ plugin: 'text' }) }), 2),
  rows: list(
    object({
      // TODO: How to fix the bugs when we change this to "rows"?!
      columns: list(object({ content: child({ plugin: 'text' }) }), 2),
    }),
    3
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

// From edtor-io
const RemoveButton = styled.button({
  outline: 'none',
  width: '35px',
  border: 'none',
  background: 'transparent',
})

function SerloTableEditor(props: SerloTableProps) {
  const i18n = useI18n()
  const { headers, rows } = props.state

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
      <tr>
        <td />
        {R.range(0, headers.length).map((column) => (
          <td style={{ textAlign: 'center' }}>
            <RemoveButton
              onClick={() => {
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
            {content.render({
              config: { placeholder: i18n.t('Create header') },
            })}
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
          {columns.map(({ content }, columnIndex) => (
            <TableCell key={columnIndex}>
              {content.render({
                config: { placeholder: i18n.t('<content>') },
              })}
            </TableCell>
          ))}
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
            {columns.map(({ content }, columnIndex) => (
              <TableCell key={columnIndex}>
                {!isEmpty(content.id)(store.getState()) && content.render()}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
