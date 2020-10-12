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
import axios from 'axios'
import * as R from 'ramda'

import { testingServerUrl } from './_config'

describe('/api/events', () => {
  test('without arguments: returns list of first 100 ids', async () => {
    const response = await fetchPath('/api/events')

    expect(response.data).toEqual({
      totalCount: 84706,
      eventIds: R.range(1, 101),
      pageInfo: { hasNextPage: true, hasPreviousPage: false },
    })
  })

  test('with ?after=1000', async () => {
    const response = await fetchPath('/api/events?after=1000')

    expect(response.data).toEqual({
      totalCount: 84706,
      eventIds: R.range(1001, 1101),
      pageInfo: { hasNextPage: true, hasPreviousPage: true },
    })
  })

  test('with ?before=1000', async () => {
    const response = await fetchPath('/api/events?before=1000')

    expect(response.data).toEqual({
      totalCount: 84706,
      eventIds: R.range(900, 1000),
      pageInfo: { hasNextPage: true, hasPreviousPage: true },
    })
  })

  test('with ?first=2', async () => {
    const response = await fetchPath('/api/events?first=2')

    expect(response.data).toEqual({
      totalCount: 84706,
      eventIds: [1, 2],
      pageInfo: { hasNextPage: true, hasPreviousPage: false },
    })
  })

  test('with ?last=2', async () => {
    const response = await fetchPath('/api/events?last=2')

    expect(response.data).toEqual({
      totalCount: 84706,
      eventIds: [86590, 86591],
      pageInfo: { hasNextPage: false, hasPreviousPage: true },
    })
  })

  test('with ?userId=10', async () => {
    const response = await fetchPath('/api/events?userId=10&first=3')

    expect(response.data).toEqual({
      totalCount: 3075,
      eventIds: [37494, 38065, 38379],
      pageInfo: { hasNextPage: true, hasPreviousPage: false },
    })
  })

  test('with ?uuid=16030', async () => {
    const response = await fetchPath('/api/events?uuid=16030&last=3')

    expect(response.data).toEqual({
      totalCount: 10,
      eventIds: [55786, 59392, 61858],
      pageInfo: { hasNextPage: false, hasPreviousPage: true },
    })
  })

  test('handles empty results correctly', async () => {
    const notExistingUserId = '111'
    const response = await fetchPath('/api/events?userId=' + notExistingUserId)

    expect(response.data).toEqual({
      totalCount: 0,
      eventIds: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    })
  })

  test('content type is application/json and charset is utf8', async () => {
    const response = await fetchPath('/api/events')

    expect(response.headers['content-type']).toBe(
      'application/json; charset=utf-8'
    )
  })
})

describe('/api/alias/:alias', () => {
  describe('/api/alias/user/profile/:username', () => {
    test('when user does not exist', async () => {
      const response = await fetchPath('/api/alias/user/profile/not-existing')

      expect(response.data).toBeNull()
    })
  })
})

function fetchPath(path: string) {
  return axios.get(testingServerUrl + path)
}
