import { Verifier } from '@pact-foundation/pact'

test('Pacts', async () => {
  jest.setTimeout(60000)
  const handler = {
    get() {
      return () => {
        return Promise.resolve()
      }
    }
  }
  const stateHandlers = new Proxy({}, handler)
  await new Verifier({
    provider: 'serlo.org',
    providerBaseUrl: 'http://de.serlo.localhost:4567',
    pactBrokerUrl: 'https://pacts.serlo.org',
    validateSSL: false,
    stateHandlers
  }).verifyProvider()
})
