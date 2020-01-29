import {
  rowsToSolutionSteps,
  migrateSolutionStepsState
} from '../../src/deserialize'
import { Edtr, RowsPlugin } from '@serlo/legacy-editor-to-editor'

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
    {
      type: 'step',
      isHalf: false,
      content: { plugin: 'rows', state: [{ plugin: 'text', state: {} }] }
    },
    { type: 'step', isHalf: true, content: { plugin: 'text', state: {} } },
    {
      type: 'explanation',
      isHalf: true,
      content: { plugin: 'text', state: {} }
    },
    {
      type: 'step',
      isHalf: false,
      content: { plugin: 'rows', state: [{ plugin: 'text', state: {} }] }
    }
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
    {
      type: 'step',
      isHalf: false,
      content: { plugin: 'rows', state: [{ plugin: 'text', state: {} }] }
    },
    {
      type: 'step',
      isHalf: false,
      content: {
        plugin: 'rows',
        state: [
          {
            plugin: 'layout',
            state: [
              { child: { plugin: 'text', state: {} }, width: 1 },
              { child: { plugin: 'text', state: {} }, width: 1 },
              { child: { plugin: 'text', state: {} }, width: 1 }
            ]
          }
        ]
      }
    },
    {
      type: 'step',
      isHalf: false,
      content: { plugin: 'rows', state: [{ plugin: 'text', state: {} }] }
    }
  ])
})

test('migrate new state: introduction', () => {
  const oldState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: { plugin: 'text', state: {} },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'text', state: {} }]
              }
            }
          ]
        }
      }
    ]
  }

  const newState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'text', state: {} }]
              }
            }
          ]
        }
      }
    ]
  }

  expect(migrateSolutionStepsState(oldState)).toEqual(newState)
})

test('migrate new state: step without rows', () => {
  const oldState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: { plugin: 'image', state: {} }
            }
          ]
        }
      }
    ]
  }

  const newState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'image', state: {} }]
              }
            }
          ]
        }
      }
    ]
  }

  expect(migrateSolutionStepsState(oldState)).toEqual(newState)
})

test('migrate new state: more than one solution', () => {
  const oldState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: { plugin: 'text', state: {} },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'text', state: {} }]
              }
            }
          ]
        }
      },
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: { plugin: 'image', state: {} }
            }
          ]
        }
      }
    ]
  }

  const newState: SolutionPlugin = {
    plugin: 'solution',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'text', state: {} }]
              }
            }
          ]
        }
      },
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [{ plugin: 'text', state: {} }]
          },
          additionals: undefined,
          strategy: undefined,
          solutionSteps: [
            {
              isHalf: false,
              type: 'step',
              content: {
                plugin: 'rows',
                state: [{ plugin: 'image', state: {} }]
              }
            }
          ]
        }
      }
    ]
  }

  expect(migrateSolutionStepsState(oldState)).toEqual(newState)
})
type SolutionPlugin = {
  plugin: 'solution'
  state: {
    plugin: 'solutionSteps'
    state: {
      introduction: Edtr
      strategy: RowsPlugin | undefined
      solutionSteps: {
        type: string
        isHalf: boolean
        content: Edtr
      }[]
      additionals: RowsPlugin | undefined
    }
  }[]
}
