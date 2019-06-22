/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
// @ts-ignore
import createCloudflare from 'cloudflare'
import * as request from 'request'

export const accountId = '3bfabc4463c2c3c340f7301d22ed18c0'
export const zoneId = '1a4afa776acb2e40c3c8a135248328ae'
export const secret = require('./cloudflare.secret.json')

export const cloudflare = createCloudflare(secret)

export async function uploadWorker({
  name,
  body
}: {
  name: string
  body: string
}) {
  await new Promise((resolve, reject) => {
    request.put(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}`,
      {
        headers: {
          'X-Auth-Email': secret.email,
          'X-Auth-Key': secret.key,
          'Content-Type': 'application/javascript'
        },
        body
      },
      error => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      }
    )
  })
}

export async function publishPackage({
  name,
  version
}: {
  name: string
  version: string
}) {
  const environments = getEnvironments()
  await Promise.all(
    environments.map(env => {
      return new Promise((resolve, reject) => {
        request.put(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/19f90dc8e6ff49cd8bc42f51346409be/values/${name}@${env}`,
          {
            headers: {
              'X-Auth-Email': secret.email,
              'X-Auth-Key': secret.key
            },
            body: `${name}@${version}`
          },
          error => {
            if (error) {
              reject(error)
              return
            }

            resolve()
          }
        )
      })
    })
  )

  function getEnvironments() {
    const [major, minor] = version.split('.')
    return [major, `${major}.${minor}`, version]
  }
}
