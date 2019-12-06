import { Matchers, MessageConsumerPact, Pact } from '@pact-foundation/pact'
import axios from 'axios'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

const rm = util.promisify(rimraf)

const root = path.join(__dirname, '..')
const pactDir = path.join(root, 'pacts')

describe('HTTP Contract', () => {
  const httpPact = new Pact({
    consumer: 'serlo.org',
    provider: 'Commenting System',
    port: 9009,
    log: path.join(root, 'pact-http.log'),
    dir: path.join(pactDir, 'http')
  })

  beforeAll(async () => {
    await rm(pactDir)
    await httpPact.setup()
  })

  afterEach(async () => {
    await httpPact.verify()
  })

  afterAll(async () => {
    await httpPact.finalize()
  })

  test('GETting all threads (empty response)', async () => {
    await httpPact.addInteraction({
      state: 'no threads exist',
      uponReceiving: 'get all threads for entity 123',
      withRequest: {
        method: 'GET',
        path: '/threads/serlo.org/123/'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: []
      }
    })
    await axios.get('http://localhost:9009/threads/serlo.org/123/')
  })

  test('GETting all threads (one thread)', async () => {
    await httpPact.addInteraction({
      state: 'one thread for entity 234 exists',
      uponReceiving: 'get all threads for entity 234',
      withRequest: {
        method: 'GET',
        path: '/threads/serlo.org/234/'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: [
          {
            id: Matchers.uuid(),
            title: 'Antwort auf Frage XY',
            comments: [
              {
                id: Matchers.uuid(),
                content: 'Ich habe folgende Frage',
                author: { user_id: '456', provider_id: 'serlo.org' },
                created_at: Matchers.iso8601DateTime()
              }
            ]
          }
        ]
      }
    })
    await axios.get('http://localhost:9009/threads/serlo.org/234/')
  })
})

describe('Message Contract', () => {
  const messagePact = new MessageConsumerPact({
    consumer: 'serlo.org',
    provider: 'Commenting System',
    log: path.join(root, 'pact-message.log'),
    dir: path.join(pactDir, 'message')
  })

  test('create-thread', async () => {
    const message = {
      type: 'create-thread',
      payload: {
        author: {
          provider_id: 'serlo.org',
          user_id: '456'
        },
        entity: {
          provider_id: 'serlo.org',
          id: '123'
        },
        title: 'Title',
        content: 'Content',
        created_at: Matchers.iso8601DateTime(),
        source: {
          provider_id: 'serlo.org',
          type: 'discussion/create'
        }
      }
    }
    await messagePact
      .given('no threads exist')
      .expectsToReceive('a `create-thread` message')
      .withContent(message)
      .verify(async message => {
        // Check here if the message is correct :)
        // console.log(message.contents)
      })
  })

  test('create-comment', async () => {
    const message = {
      type: 'create-comment',
      payload: {
        author: {
          provider_id: 'serlo.org',
          user_id: '456'
        },
        thread_id: Matchers.uuid(),
        entity: {
          provider_id: 'serlo.org',
          id: '234'
        },
        content: 'Content',
        created_at: Matchers.iso8601DateTime(),
        source: {
          provider_id: 'serlo.org',
          type: 'discussion/create'
        }
      }
    }
    await messagePact
      .given('one thread for entity 234 exists')
      .expectsToReceive('a `create-comment` message')
      .withContent(message)
      .verify(async message => {
        // Check here if the message is correct :)
        // console.log(message.contents)
      })
  })
})
