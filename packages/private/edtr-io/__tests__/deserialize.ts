import { deserialize, DeserializeSuccess } from '../src/deserialize'

describe('text-solution', () => {
  test('initial', () => {
    const initialState = assertSuccessfulDeserialize(
      createTextSolutionState('')
    ) as { plugin: string; state: { content: any } }
    expect(initialState.plugin).toEqual('type-text-solution')
    const content = JSON.parse(initialState.state.content)
    expect(content.plugin).toEqual('solution')
    const steps = content.state
    expect(steps).toHaveLength(1)
    const step = steps[0]
    expect(step.plugin).toEqual('solutionSteps')
  })

  test('legacy solution (empty)', () => {
    const initialState = assertSuccessfulDeserialize(
      createTextSolutionState('{"plugin":"rows","state":[]}')
    ) as { plugin: string; state: { content: any } }
    expect(initialState.plugin).toEqual('type-text-solution')
    const content = JSON.parse(initialState.state.content)
    expect(content.plugin).toEqual('solution')
    const steps = content.state
    expect(steps).toHaveLength(1)
  })

  test('legacy solution (real-world example)', () => {
    const initialState = assertSuccessfulDeserialize(
      createTextSolutionState(
        '{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"@splish-me/h3","data":{},"nodes":[{"object":"text","text":"Radius","marks":[]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Die Formel findest du im Artikel zum ","marks":[]},{"object":"inline","type":"@splish-me/a","data":{"href":"/1557"},"nodes":[{"object":"text","text":"Radius","marks":[]}]},{"object":"text","text":".","marks":[]}]}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Die richtige Antwort ist "}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"A=\\\\pi \\\\cdot r^2","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"A=\\\\pi \\\\cdot r^2"}]}]},{"object":"text","leaves":[{"object":"leaf","text":". Sie ist die einzige Formel unter den AntwortmÃ¶glichkeiten, bei der du eine FlÃ¤che als Ergebnis erhÃ¤ltst. Rechne zum Beispiel mit "}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r=1\\\\text{ cm}","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"r=1\\\\text{ cm}"}]}]},{"object":"text","leaves":[{"object":"leaf","text":". Dann erhÃ¤ltst du "}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"A=\\\\pi \\\\cdot 1 \\\\text{ cm}^2 \\\\approx 3,14 \\\\text{ cm}^2","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"A=\\\\pi \\\\cdot 1 \\\\text{ cm}^2 \\\\approx 3,14 \\\\text{ cm}^2"}]}]},{"object":"text","leaves":[{"object":"leaf","text":". In den anderen Formeln kommt der Radius "}]},{"object":"inline","type":"@splish-me/katex-inline","data":{"formula":"r","inline":true},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"r"}]}]},{"object":"text","leaves":[{"object":"leaf","text":" ohne Quadrat vor und dein Ergebnis wird keine FlÃ¤che."}]}]}]}}}]}'
      )
    ) as { plugin: string; state: { content: any } }
    expect(initialState.plugin).toEqual('type-text-solution')
    const content = JSON.parse(initialState.state.content)
    expect(content.plugin).toEqual('solution')
    const steps = content.state
    expect(steps).toHaveLength(1)
  })

  test('converted solution', () => {
    const initialState = assertSuccessfulDeserialize(
      createTextSolutionState('{"plugin":"solution","state":[]}')
    ) as { plugin: string; state: { content: any } }
    expect(initialState.plugin).toEqual('type-text-solution')
    const content = JSON.parse(initialState.state.content)
    expect(content.plugin).toEqual('solution')
    const steps = content.state
    expect(steps).toHaveLength(0)
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
