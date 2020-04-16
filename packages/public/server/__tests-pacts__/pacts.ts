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
import { Verifier } from '@pact-foundation/pact'

const timeout = 60000

test('Pacts', async () => {
  jest.setTimeout(timeout)
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
    stateHandlers,
    timeout
  }).verifyProvider()
})