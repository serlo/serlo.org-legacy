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
import { Verifier } from '@pact-foundation/pact'
import { spawnSync } from 'child_process'

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-commonjs
const { version } = require('../package.json')

const timeout = 120 * 1000

test('Pacts', async () => {
  jest.setTimeout(timeout)

  const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
    stdio: 'pipe',
  })
  const hash = String(result.stdout).trim()

  const providerVersion = `${version}-${hash}`

  const handler = {
    get() {
      return () => {
        return Promise.resolve()
      }
    },
  }
  const stateHandlers = new Proxy({}, handler)
  await new Verifier({
    provider: 'serlo.org',
    providerVersion,
    providerBaseUrl: 'http://de.serlo.localhost:4567',
    pactBrokerUrl: 'https://pact.serlo.org',
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
    publishVerificationResult:
      process.env.PUBLISH_VERIFICATION_RESULT === 'true',
    validateSSL: false,
    stateHandlers,
    timeout,
  }).verifyProvider()
})
