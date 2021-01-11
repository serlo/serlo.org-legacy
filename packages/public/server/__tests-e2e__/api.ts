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

const mutationEndpoints = {
  '/api/thread/start-thread': {
    title: 'A new thread',
    content: 'Hello World',
    objectId: 1855,
    userId: 10,
  },
  '/api/thread/comment-thread': {
    content: 'Hello World',
    objectId: 27778,
    userId: 10,
  },
}

describe('/api/thread/start-thread', () => {
  const body = mutationEndpoints['/api/thread/start-thread']

  describe('starts a new thread', () => {
    const expectedPayload = {
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: body.userId,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: body.content,
      parentId: body.objectId,
      title: body.title,
      trashed: false,
    }
    let comment: unknown

    beforeAll(async () => {
      await fetchApi('/api/e2e-tests/set-up')

      const init = withJsonBody(body)
      const response = await fetchApi('/api/thread/start-thread', init)
      comment = await response.json()
    })

    test('returns comment payload of newly created comment', async () => {
      expect(comment).toEqual(expectedPayload)
    })

    test('returns the same payload as /api/uuid/:id', async () => {
      assertExpectEqual(comment, expectedPayload)

      await expectUuid(comment)
    })

    test('creates a new event to the event log', async () => {
      assertExpectEqual(comment, expectedPayload)

      await expectEvent({
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

  test('returns 400 when uuid is not commentable', async () => {
    const init = withJsonBody({ ...body, objectId: 1 })
    await expect400('/api/thread/start-thread', init)
  })
})

describe('/api/thread/comment-thread', () => {
  const body = mutationEndpoints['/api/thread/comment-thread']

  describe('adds a new comment', () => {
    let comment: unknown
    const expectedPayload = {
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: body.userId,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: body.content,
      parentId: body.objectId,
      title: null,
      trashed: false,
    }

    beforeAll(async () => {
      await fetchApi('/api/e2e-tests/set-up')

      const init = withJsonBody(body)
      const response = await fetchApi('/api/thread/comment-thread', init)
      comment = await response.json()
    })

    test('returns comment payload of newly created comment', async () => {
      expect(comment).toEqual(expectedPayload)
    })

    test('returns the same payload as /api/uuid/:id', async () => {
      assertExpectEqual(comment, expectedPayload)

      await expectUuid(comment)
    })

    test('creates a new event to the event log', async () => {
      assertExpectEqual(comment, expectedPayload)

      await expectEvent({
        id: expect.any(Number),
        objectId: comment.id,
        instance: 'de',
        date: matchDate(comment.date),
        threadId: comment.parentId,
        __typename: 'CreateCommentNotificationEvent',
        actorId: comment.authorId,
        commentId: comment.id,
      })
    })
  })

  test('returns 400 when one wants to comment a thread answer', async () => {
    const init = withJsonBody({ ...body, objectId: 15470 })
    await expect400('/api/thread/comment-thread', init)
  })
})

describe('api mutation endpoints', () => {
  describe.each(R.toPairs(mutationEndpoints))('%s', (url, validBody) => {
    describe('returns 400', () => {
      describe('when one of the necessary arguments is missing', () => {
        test.each(Object.keys(validBody))('%s', async (key) => {
          await expect400(url, withJsonBody(R.omit([key], validBody)))
        })
      })

      describe('when one of the necessary arguments is malformed', () => {
        test.each(Object.keys(validBody))('%s', async (key) => {
          const body = { ...validBody, [key]: { malformed: true } }
          await expect400(url, withJsonBody(body))
        })
      })

      test('when additional arguments are supplied', async () => {
        await expect400(url, withJsonBody({ ...validBody, foo: 42 }))
      })

      test('when body is not a dictionary', async () => {
        await expect400(url, withJsonBody(true))
      })

      test('when body is malformed JSON', async () => {
        await expect400(url, withMalformedJson())
      })

      if ('userId' in validBody) {
        test('when userId does not belong to a user', async () => {
          await expect400(url, withJsonBody({ ...validBody, userId: 1855 }))
        })
      }

      if ('objectId' in validBody) {
        test('when objectId does not belong to an uuid', async () => {
          const init = withJsonBody({ ...validBody, objectId: 10000000 })
          await expect400(url, init)
        })
      }
    })

    test('returns 404 when request method is not POST', async () => {
      const response = await fetchApi(url)
      expect(response.status).toBe(404)
    })
  })
})

describe('/api/subscriptions/:userId', () => {
  test('returns null when user does not exist', async () => {
    const response = await fetchApi('/api/subscriptions/10000')

    expect(await response.json()).toBeNull()
  })
})

async function expect400(url: string, init: RequestInit) {
  const response = await fetchApi(url, init)
  expect(response.status).toBe(400)
}

async function expectUuid(payload: { id: number }) {
  const response = await fetchApi(`/api/uuid/${payload.id}`)
  expect(await response.json()).toEqual(payload)
}

async function expectEvent(event: unknown) {
  const response = await fetchApi('/api/e2e-tests/events-since-set-up')
  const { events } = await response.json()

  expect(events).toContainEqual(event)
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

function assertExpectEqual<T>(obj: unknown, target: T): asserts obj is T {
  expect(obj).toEqual(target)
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
