import { deserialize, DeserializeSuccess } from '../../src/deserialize'

test('initial', () => {
  const initialState = assertSuccessfulDeserialize(createTextSolutionState(''))
  expect(initialState.plugin).toEqual('type-text-solution')
  assertContentToMatch(initialState, {
    plugin: 'rows',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text'
              }
            ]
          },
          solutionSteps: []
        }
      }
    ]
  })
})

function createTextSolutionState(
  content: string
): Parameters<typeof deserialize>[0] {
  return {
    initialState: {
      id: 1,
      revision: 2,
      license: {
        id: 3,
        title: 'License',
        url: 'https://example.com',
        agreement: 'Agreement',
        iconHref: 'iconHref'
      },
      content
    },
    type: 'text-solution'
  }
}

function assertSuccessfulDeserialize(...args: Parameters<typeof deserialize>) {
  const result = deserialize(...args)
  expect((result as DeserializeSuccess).success).toBeTruthy()
  return (result as DeserializeSuccess).initialState
}

function assertContentToMatch(
  result: DeserializeSuccess['initialState'],
  expected: unknown
) {
  const serializedContent = (result.state as { content: string }).content
  const content = JSON.parse(serializedContent)
  expect(content).toEqual(expected)
}
