import { rowsToSolutionSteps } from '../../src/deserialize'
import { Edtr } from '@serlo/legacy-editor-to-editor'

test('basic example', () => {
  const rows: Edtr[] = [
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
  expect(rowsToSolutionSteps(rows)).toEqual([
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } },
    { type: 'step', isHalf: true, content: { plugin: 'text', state: {} } },
    {
      type: 'explanation',
      isHalf: true,
      content: { plugin: 'text', state: {} }
    },
    { type: 'step', isHalf: false, content: { plugin: 'text', state: {} } }
  ])
})

test('three column layout', () => {
  const rows: Edtr[] = [
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
  expect(rowsToSolutionSteps(rows)).toEqual([
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
  ])
})
