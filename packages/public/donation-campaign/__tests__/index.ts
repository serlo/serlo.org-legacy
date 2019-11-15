import { processSheetsResponse } from '../src'

test('Successful process of sheets response', async () => {
  const result = processSheetsResponse([
    {
      values: [[200, 500]]
    },
    {
      values: [
        ['foobar1', '2019-11-14T00:00', '25', '100', '0', '1', '50', '2', '50'],
        ['foobar2', '2019-11-15T00:00', '100', '50', '50', '1', '100', '2', '0']
      ]
    },
    { values: [['A', 'widgetA'], ['B', 'widgetB']] },
    {
      values: [['1', 'heading1', 'body1'], ['2', 'heading2', 'body2']]
    }
  ])
  expect(result).toEqual({
    id: 'foobar2',
    texts: [
      { heading: 'heading1', body: 'body1' },
      { heading: 'heading2', body: 'body2' }
    ],
    widgets: ['widgetA', 'widgetB'],
    enabledProbability: 1,
    textAProbability: 1,
    widgetAProbability: 0.5,
    progress: {
      value: 200,
      max: 500
    }
  })
})
