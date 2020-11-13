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

describe('/api/event/:id', () => {
  test('returns event when the instance of the event and the url do not match', async () => {
    const response = await fetchAlias({ instance: 'de', path: '/api/event/10' })

    expect(response.data).toEqual({
      id: 10,
      instance: 'de',
      date: '2014-03-01T20:36:34+01:00',
      __typename: 'CreateTaxonomyLinkNotificationEvent',
      actorId: 6,
      parentId: 8,
      childId: 1208,
    })
  })
})

describe('/api/alias/:alias', () => {
  describe('/api/alias/user/profile/:username', () => {
    test('when user does not exist', async () => {
      const response = await fetchAlias({
        path: '/api/alias/user/profile/not-existing',
      })

      expect(response.data).toBeNull()
    })
  })
})

function fetchAlias({
  path,
  instance = 'de',
}: {
  path: string
  instance?: string
}) {
  return axios.get(`http://${instance}.serlo.localhost:4567${path}`)
}
