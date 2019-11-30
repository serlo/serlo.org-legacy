import { Pact } from '@pact-foundation/pact'
import axios from 'axios'
import * as path from 'path'

const provider = new Pact({
  consumer: 'serlo.org',
  provider: 'Commenting System',
  port: 9009,
  log: path.resolve(process.cwd(), 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn'
})

beforeAll(async () => {
  await provider.setup()
})
test('empty', async () => {
  await provider.addInteraction({
    state: 'no threads',
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
  const { data } = await axios.get(
    'http://localhost:9009/threads/serlo.org/123/'
  )
  expect(data).toEqual([])
})

test('non-empty', async () => {
  await provider.addInteraction({
    state: 'one thread for entity 234',
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
          id: 'barfoo',
          title: 'Antwort auf Frage XY',
          comments: [
            {
              id: 'foobar',
              content: 'Ich habe folgende Frage',
              author: { user_id: '456', provider_id: 'serlo.org' },
              created_at: '2019-11-11 11:11:11+02:00'
            }
          ]
        }
      ]
    }
  })
  const { data } = await axios.get(
    'http://localhost:9009/threads/serlo.org/234/'
  )
  expect(data).toEqual([
    {
      id: 'barfoo',
      title: 'Antwort auf Frage XY',
      comments: [
        {
          id: 'foobar',
          content: 'Ich habe folgende Frage',
          author: { user_id: '456', provider_id: 'serlo.org' },
          created_at: '2019-11-11 11:11:11+02:00'
        }
      ]
    }
  ])
})

afterEach(async () => {
  await provider.verify()
})

afterAll(async () => {
  await provider.finalize()
})
