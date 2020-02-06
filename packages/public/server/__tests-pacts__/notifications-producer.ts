import { Verifier } from '@pact-foundation/pact'

test('HTTP Contract', async () => {
  await new Verifier({
    provider: 'serlo.org:http',
    providerBaseUrl: 'http://de.serlo.localhost:4567',
    pactBrokerUrl: 'https://pacts.serlo.org',
    validateSSL: false,
    stateHandlers: {
      'a event with id 234 exists': async () => {}
    }
  }).verifyProvider()
})
