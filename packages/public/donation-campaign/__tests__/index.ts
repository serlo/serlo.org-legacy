/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { processSheetsResponse } from '../src'

test('Successful process of sheets response', async () => {
  const result = processSheetsResponse([
    {
      values: [[200, 500]]
    },
    {
      values: [
        [
          'foobar1',
          '2019-11-14T00:00',
          '25',
          '100',
          '0',
          '1',
          '50',
          '2',
          '50',
          '3'
        ],
        [
          'foobar2',
          '2019-11-15T00:00',
          '100',
          '50',
          '50',
          '1',
          '100',
          '2',
          '0',
          '3'
        ]
      ]
    },
    {
      values: [
        ['A', 'widgetA', '50', 'yearly'],
        ['B', 'widgetB', '50', 'yearly']
      ]
    },
    {
      values: [
        ['1', 'heading1', 'body1'],
        ['2', 'heading2', 'body2']
      ]
    }
  ])
  expect(result).toEqual({
    id: 'foobar2',
    texts: [
      { heading: 'heading1', body: 'body1' },
      { heading: 'heading2', body: 'body2' }
    ],
    widgets: [
      {
        url: 'widgetA',
        amount: '50',
        rhythm: 'yearly'
      },
      {
        url: 'widgetB',
        amount: '50',
        rhythm: 'yearly'
      }
    ],
    enabledProbability: 1,
    textAProbability: 1,
    widgetAProbability: 0.5,
    progress: {
      value: 200,
      max: 500
    },
    frequency: 3
  })
})
