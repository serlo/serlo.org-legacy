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

describe('/api/subscriptions/:userId', () => {
  test('returns null when user does not exist', async () => {
    const response = await fetchApi('/api/subscriptions/10000')

    expect(await response.json()).toBeNull()
  })
})

const userId = 1
const articleId = 1855
const firstCommentId = 27778
const answerCommentId = 15470

describe('/api/thread/start-thread', () => {
  const validBody = {
    title: 'A new thread',
    content: 'Hello World',
    objectId: articleId,
    userId,
  }

  describe('starts a new thread', () => {
    const expectedPayload = {
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: validBody.userId,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: validBody.content,
      parentId: validBody.objectId,
      title: validBody.title,
      trashed: false,
    }
    let comment: unknown

    beforeAll(async () => {
      await setUpTestHelper()

      const init = withJsonBody(validBody)
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

  test('returns 400 when objectId does not belong to an uuid', async () => {
    const init = withJsonBody({ ...validBody, objectId: 10000000 })
    await expect400('/api/thread/start-thread', init)
  })

  test('returns 400 when uuid is not commentable', async () => {
    const init = withJsonBody({ ...validBody, objectId: userId })
    await expect400('/api/thread/start-thread', init)
  })

  test('returns 400 when uuid is a comment', async () => {
    const init = withJsonBody({ ...validBody, objectId: firstCommentId })
    await expect400('/api/thread/start-thread', init)
  })

  testRequestMethodMustBePost('/api/thread/comment-thread')

  testValidatesRequestBody({ url: '/api/thread/start-thread', validBody })
})

describe('/api/thread/comment-thread', () => {
  const validBody = {
    content: 'Hello World',
    threadId: firstCommentId,
    userId,
  }

  describe('adds a new comment', () => {
    let comment: unknown
    const expectedPayload = {
      __typename: 'Comment',
      alias: expect.any(String),
      archived: false,
      authorId: validBody.userId,
      childrenIds: [],
      date: expect.any(String),
      id: expect.any(Number),
      content: validBody.content,
      parentId: validBody.threadId,
      title: null,
      trashed: false,
    }

    beforeAll(async () => {
      await setUpTestHelper()

      const init = withJsonBody(validBody)
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

  test('returns 400 when threadId is not a comment', async () => {
    const init = withJsonBody({ ...validBody, threadId: articleId })
    await expect400('/api/thread/comment-thread', init)
  })

  test('returns 400 when one wants to comment a thread answer', async () => {
    const init = withJsonBody({ ...validBody, threadId: answerCommentId })
    await expect400('/api/thread/comment-thread', init)
  })

  testRequestMethodMustBePost('/api/thread/comment-thread')

  testUserIdMustBeValid({ url: '/api/thread/start-thread', validBody })

  testValidatesRequestBody({ url: '/api/thread/comment-thread', validBody })
})

describe('/api/thread/set-archive', () => {
  const validBody = { userId, archived: false, id: firstCommentId }

  describe('when it changes the archived state', () => {
    let commentBefore: any
    let commentAfter: any

    beforeAll(async () => {
      commentBefore = await givenComment()
      await setUpTestHelper()

      const response = await fetchApi(
        '/api/thread/set-archive',
        withJsonBody({ userId, archived: true, id: commentBefore.id })
      )
      expect(response.status).toBe(200)
      commentAfter = await response.json()
    })

    test('returns comment payload with archived state changed', async () => {
      expect(commentAfter).toEqual({ ...commentBefore, archived: true })
    })

    test('persists the new comment state', async () => {
      await expectUuid(commentAfter)
    })

    test('creates a new event in the event log', async () => {
      await expectEvent({
        __typename: 'SetThreadStateNotificationEvent',
        id: expect.any(Number),
        instance: 'de',
        date: expect.any(String),
        objectId: commentAfter.id,
        actorId: userId,
        threadId: commentAfter.id,
        archived: commentAfter.archived,
      })
    })
  })

  describe('when it does not change the archived state', () => {
    let commentBefore: any
    let commentAfter: any

    beforeAll(async () => {
      commentBefore = await givenComment()
      await setUpTestHelper()

      const response = await fetchApi(
        '/api/thread/set-archive',
        withJsonBody({ userId, archived: false, id: commentBefore.id })
      )
      expect(response.status).toBe(200)
      commentAfter = await response.json()
    })

    test('returns comment payload with archived state changed', async () => {
      expect(commentAfter).toEqual(commentBefore)
    })

    test('creates no new event in the event log', async () => {
      const response = await fetchApi('/api/e2e-tests/events-since-set-up')
      const { events } = await response.json()

      expect(events).not.toContainEqual(
        expect.objectContaining({
          __typename: 'SetThreadStateNotificationEvent',
          threadId: commentAfter.id,
        })
      )
    })
  })

  test('returns 400 when id does not belong to a comment', async () => {
    await expect400(
      '/api/thread/set-archive',
      withJsonBody({ ...validBody, id: articleId })
    )
  })

  test('returns 400 when uuid with given id does not exist', async () => {
    await expect400(
      '/api/thread/set-archive',
      withJsonBody({ ...validBody, id: 1000000000 })
    )
  })

  testValidatesRequestBody({ url: '/api/thread/set-archive', validBody })

  testUserIdMustBeValid({ url: '/api/thread/set-archive', validBody })

  testRequestMethodMustBePost('/api/thread/set-archive')
})

function testValidatesRequestBody({
  url,
  validBody,
}: {
  url: string
  validBody: Record<string, unknown>
}) {
  describe('returns 400 for invalid request bodys', () => {
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
  })
}

function testUserIdMustBeValid({
  url,
  validBody,
}: {
  url: string
  validBody: Record<string, unknown>
}) {
  test('returns 400 when no user with given userId exists', async () => {
    await expect400(url, withJsonBody({ ...validBody, userId: articleId }))
  })
}

function testRequestMethodMustBePost(url: string) {
  test('returns 404 when request method is not POST', async () => {
    const response = await fetchApi(url)
    expect(response.status).toBe(404)
  })
}

async function givenComment() {
  const response = await fetchApi(
    '/api/thread/start-thread',
    withJsonBody({
      title: 'A new thread',
      content: 'Hello World',
      objectId: articleId,
      userId,
    })
  )

  return await response.json()
}

async function setUpTestHelper() {
  const response = await fetchApi('/api/e2e-tests/set-up')
  expect(response.status).toBe(200)
}

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
