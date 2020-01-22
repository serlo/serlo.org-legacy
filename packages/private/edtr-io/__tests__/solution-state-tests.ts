import { RowsPlugin } from '../../legacy-editor-to-editor'
import { rowToSolutionStepsArray } from '../src/deserialize'

test('rowToSolutionStepsArray: basic example', () => {
  const rowsState: RowsPlugin = {
    plugin: 'rows',
    state: [
      { plugin: 'text', state: {} },
      { plugin: 'text', state: {} },
      {
        plugin: 'layout',
        state: [
          { child: { plugin: 'text', state: {} }, width: 1 },
          { child: { plugin: 'text', state: {} }, width: 1 }
        ]
      },
      { plugin: 'text', state: {} }
    ]
  }
  const expectedState = [
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } },
    { type: 'step', isHalf: true, content: { plugin: 'text', state: {} } },
    {
      type: 'explanation',
      isHalf: true,
      content: { plugin: 'text', state: {} }
    },
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } }
  ]

  expect(rowToSolutionStepsArray(rowsState)).toEqual(expectedState)
})

test('rowToSolutionStepsArray: three column layout', () => {
  const rowsState: RowsPlugin = {
    plugin: 'rows',
    state: [
      { plugin: 'text', state: {} },
      { plugin: 'text', state: {} },
      {
        plugin: 'layout',
        state: [
          { child: { plugin: 'text', state: {} }, width: 1 },
          { child: { plugin: 'text', state: {} }, width: 1 },
          { child: { plugin: 'text', state: {} }, width: 1 }
        ]
      },
      { plugin: 'text', state: {} }
    ]
  }
  // first element is not in result but in the introduction of the solutionsteps plugin
  const expectedState = [
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } },
    {
      type: 'step',
      isHalf: false,
      content: {
        plugin: 'layout',
        state: [
          { child: { plugin: 'text', state: {} }, width: 1 },
          { child: { plugin: 'text', state: {} }, width: 1 },
          { child: { plugin: 'text', state: {} }, width: 1 }
        ]
      }
    },
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } }
  ]
  expect(rowToSolutionStepsArray(rowsState)).toEqual(expectedState)
})
