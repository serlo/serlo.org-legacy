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
    provider: 'notifications',
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

  test('GETting all notifications (empty response)', async () => {
    await httpPact.addInteraction({
      state: 'no notifications exist',
      uponReceiving: 'get all notifications for user 123',
      withRequest: {
        method: 'GET',
        path: '/notifications/serlo.org/123/html'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: []
      }
    })
    await axios.get('http://localhost:9009/notifications/serlo.org/123/html')
  })

  test('GETting all notifications (one notification response)', async () => {
    await httpPact.addInteraction({
      state: 'a notifications for user 123 and event 234 exists',
      uponReceiving: 'get all notifications for user 123',
      withRequest: {
        method: 'GET',
        path: '/notifications/serlo.org/123/html'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: [
          {
            event: {
              provider_id: 'serlo.org',
              id: '234'
            },
            content: Matchers.string(),
            created_at: Matchers.iso8601DateTime()
          }
        ]
      }
    })
    await axios.get('http://localhost:9009/notifications/serlo.org/123/html')
  })
})

describe('Message Contract', () => {
  const messagePact = new MessageConsumerPact({
    consumer: 'serlo.org',
    provider: 'notifications',
    log: path.join(root, 'pact-message.log'),
    dir: path.join(pactDir, 'message')
  })

  test('create-event', async () => {
    const message = {
      type: 'create-event',
      payload: {
        event: {
          provider_id: 'serlo.org',
          id: '123'
        },
        user: {
          provider_id: 'serlo.org',
          id: '234'
        },
        created_at: Matchers.iso8601DateTime(),
        source: {
          provider_id: 'serlo.org'
        }
      }
    }
    await messagePact
      .given('no notifications exist')
      .expectsToReceive('a `create-event` message')
      .withContent(message)
      .verify(async message => {
        // Check here if the message is correct :)
        // console.log(message.contents)
      })
  })

  test('create-notification', async () => {
    const message = {
      type: 'create-notification',
      payload: {
        event: {
          provider_id: 'serlo.org',
          id: '123'
        },
        user: {
          provider_id: 'serlo.org',
          id: '234'
        },
        created_at: Matchers.iso8601DateTime(),
        source: {
          provider_id: 'serlo.org'
        }
      }
    }
    await messagePact
      .given('one event with id 123 exists')
      .expectsToReceive('a `create-notification` message')
      .withContent(message)
      .verify(async message => {
        // Check here if the message is correct :)
        // console.log(message.contents)
      })
  })

  test('read-notification', async () => {
    const message = {
      type: 'read-notification',
      payload: {
        event: {
          provider_id: 'serlo.org',
          id: '234'
        },
        user: {
          provider_id: 'serlo.org',
          id: '123'
        },
        created_at: Matchers.iso8601DateTime(),
        source: {
          provider_id: 'serlo.org'
        }
      }
    }
    await messagePact
      .given('a notification for user 123 and event 234 exists')
      .expectsToReceive('a `read-notification` message')
      .withContent(message)
      .verify(async message => {
        // Check here if the message is correct :)
        // console.log(message.contents)
      })
  })
})
