/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
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
  const payloadStartThread = {
    title: 'A new thread',
    content: 'Hello World',
    objectId: 1855,
    userId: 10,
  }

  describe('starts a new thread when objectId is not a comment', () => {
    const target = {
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
    }
    let comment: unknown

    beforeAll(async () => {
      await fetchApi('/api/e2e-tests/set-up')

      const response = await fetchApi(
        '/api/add-comment',
        withJsonBody(payloadStartThread)
      )
      comment = await response.json()
    })

    test('returns comment payload of newly created comment', async () => {
      assertEqual(comment, target)
    })

    test('returns the same payload as /api/uuid/:id', async () => {
      assertEqual(comment, target)
      const response = await fetchApi(`/api/uuid/${comment.id}`)
      expect(await response.json()).toEqual(comment)
    })

    test('creates a new event to the event log', async () => {
      assertEqual(comment, target)

      const response = await fetchApi('/api/e2e-tests/events-since-set-up')
      const { events } = await response.json()

      expect(events).toContainEqual({
        id: expect.any(Number),
        instance: 'de',
        date: matchDate(comment.date),
        objectId: comment.parentId,
        __typename: 'CreateThreadNotificationEvent',
        actorId: comment.authorId,
        threadId: comment.id,
      })
    })
  })

  test('title = null is allowed', async () => {
    const payload = { ...payloadStartThread, title: null }
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
      title: null,
      trashed: false,
    })
  })

  describe('comments a new thread when objectId is a comment', () => {
    const payloadAnswerThread = { ...payloadStartThread, objectId: 27778 }
    const target = {
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: 10,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: 'Hello World',
      parentId: 27778,
      title: 'A new thread',
      trashed: false,
    }
    let comment: unknown

    beforeAll(async () => {
      await fetchApi('/api/e2e-tests/set-up')

      const response = await fetchApi(
        '/api/add-comment',
        withJsonBody(payloadAnswerThread)
      )
      comment = await response.json()
    })

    test('returns comment payload of newly created comment', async () => {
      assertEqual(comment, target)
    })

    test('returns the same payload as /api/uuid/:id', async () => {
      assertEqual(comment, target)
      const response = await fetchApi(`/api/uuid/${comment.id}`)
      expect(await response.json()).toEqual(comment)
    })

    test('creates a new event to the event log', async () => {
      assertEqual(comment, target)

      const response = await fetchApi('/api/e2e-tests/events-since-set-up')
      const { events } = await response.json()

      expect(events).toContainEqual({
        id: expect.any(Number),
        objectId: expect.any(Number),
        instance: 'de',
        date: matchDate(comment.date),
        threadId: comment.parentId,
        __typename: 'CreateCommentNotificationEvent',
        actorId: comment.authorId,
        commentId: comment.id,
      })
    })

    test('returns 400 when one wants to comment on an thread answer', async () => {
      const body = { ...payloadAnswerThread, objectId: 15470 }
      const response = await fetchApi('/api/add-comment', withJsonBody(body))
      expect(response.status).toBe(400)
    })
  })

  describe('returns 400 response', () => {
    test('when uuid is not commentable', async () => {
      assert400(withJsonBody({ ...payloadStartThread, objectId: 1 }))
    })

    test('when objectId does not belong to an uuid', async () => {
      assert400(withJsonBody({ ...payloadStartThread, objectId: 100000000 }))
    })

    test('when userId does not belong to a user', async () => {
      assert400(withJsonBody({ ...payloadStartThread, userId: 1855 }))
    })

    describe('when one of the necessary arguments is missing', () => {
      test.each(Object.keys(payloadStartThread))('%s', async (key) => {
        assert400(withJsonBody(R.omit([key], payloadStartThread)))
      })
    })

    describe('when one of the necessary arguments is malformed', () => {
      test.each(Object.keys(payloadStartThread))('%s', async (key) => {
        const body = { ...payloadStartThread, [key]: { malformed: true } }
        assert400(withJsonBody(body))
      })
    })

    test('when body is not a dictionary', async () => {
      assert400(withJsonBody(true))
    })

    test('when body is malformed JSON', async () => {
      assert400(withMalformedJson())
    })

    async function assert400(init: RequestInit) {
      const response = await fetchApi('/api/add-comment', init)
      expect(response.status).toBe(400)
    }
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

function assertEqual<T>(obj: unknown, target: T): asserts obj is T {
  expect(obj).toEqual(target)
}

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

function matchDate(dateStr: string) {
  const date = new Date(dateStr)
  date.setTime(date.getTime() + 60 * 60 * 1000)
  const regex = [date, new Date(date.getTime() + 1000)]
    .map(formatDate)
    .join('|')

  return expect.stringMatching(regex)
}

function formatDate(date: Date) {
  return (date.toISOString().substring(0, 19) + '+01:00').replace('+', '\\+')
}
