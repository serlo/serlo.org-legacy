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
import * as R from 'ramda'
import fetch, { RequestInit } from 'node-fetch'

import { testingServerUrl } from './_config'

describe('/api/alias/:alias', () => {
  describe('/api/alias/user/profile/:username', () => {
    test('returns null when user does not exist', async () => {
      const response = await fetchApi('/api/alias/user/profile/not-existing')
      expect(await response.json()).toBeNull()
    })
  })
})

describe('/api/add-comment', () => {
  const payload = {
    title: 'A new thread',
    content: 'Hello World',
    objectId: 1855,
    userId: 10,
  }

  test('starts a new thread when objectId is not a comment', async () => {
    const response = await fetchApi('/api/add-comment', withJsonBody(payload))

    expect(await response.json()).toEqual({
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: 10,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: 'Hello World',
      parentId: 1855,
      title: 'A new thread',
      trashed: false,
    })
  })

  test('/api/add-comment returns the same payload as /api/uuid/:id', async () => {
    const commentResponse = await fetchApi(
      '/api/add-comment',
      withJsonBody(payload)
    )
    const comment = (await commentResponse.json()) as any

    const uuidResponse = await fetchApi(`/api/uuid/${comment.id}`)
    expect(await uuidResponse.json()).toEqual(comment)
  })

  test('returns 400 when uuid is not commentable', async () => {
    const body = { ...payload, objectId: 1 }
    const response = await fetchApi('/api/add-comment', withJsonBody(body))
    expect(response.status).toBe(400)
  })

  test('returns 400 when objectId does not belong to an uuid', async () => {
    const body = { ...payload, objectId: 100000000 }
    const response = await fetchApi('/api/add-comment', withJsonBody(body))
    expect(response.status).toBe(400)
  })

  test('returns 400 when userId does not belong to a user', async () => {
    const body = { ...payload, userId: 1855 }
    const response = await fetchApi('/api/add-comment', withJsonBody(body))
    expect(response.status).toBe(400)
  })

  describe('returns 400 when one of the necessary arguments is missing', () => {
    test.each(Object.keys(payload))('%s', async (key) => {
      const body = R.omit([key], payload)
      const response = await fetchApi('/api/add-comment', withJsonBody(body))
      expect(response.status).toBe(400)
    })
  })

  describe('returns 400 when one of the necessary arguments is malformed', () => {
    test.each(Object.keys(payload))('%s', async (key) => {
      const body = { ...payload, [key]: { malformed: true } }
      const response = await fetchApi('/api/add-comment', withJsonBody(body))
      expect(response.status).toBe(400)
    })
  })

  test('returns 400 when body is not a dictionary', async () => {
    const response = await fetchApi('/api/add-comment', withJsonBody(true))

    expect(response.status).toBe(400)
  })

  test('returns 400 when body is malformed JSON', async () => {
    const response = await fetchApi('/api/add-comment', withMalformedJson())

    expect(response.status).toBe(400)
  })

  test('returns 404 when request method is not POST', async () => {
    const response = await fetchApi('/api/add-comment')

    expect(response.status).toBe(404)
  })
})

describe('/api/subscriptions/:userId', () => {
  test('returns null when user does not exist', async () => {
    const response = await fetchApi('/api/subscriptions/10000')

    expect(await response.json()).toBeNull()
  })
})

function fetchApi(path: string, init?: RequestInit) {
  return fetch(testingServerUrl + path, init)
}

function withJsonBody(body: unknown): RequestInit {
  return withBody(JSON.stringify(body))
}

function withMalformedJson(): RequestInit {
  return withBody('Malformed JSON')
}

function withBody(body: string): RequestInit {
  return {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  }
}
