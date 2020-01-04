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
import * as request from 'request'

export const accountId = '3bfabc4463c2c3c340f7301d22ed18c0'

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
          'X-Auth-Email': process.env.CF_EMAIL,
          'X-Auth-Key': process.env.CF_KEY,
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

export async function shouldDeployPackage({
  name,
  version
}: {
  name: string
  version: string
}) {
  if (process.env.DEPLOY !== 'true') {
    return false
  }

  const res = await new Promise((resolve, reject) => {
    request.get(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/19f90dc8e6ff49cd8bc42f51346409be/values/${name}@${version}`,
      {
        headers: {
          'X-Auth-Email': process.env.CF_EMAIL,
          'X-Auth-Key': process.env.CF_KEY
        },
        body: `${name}@${version}`
      },
      (error, res) => {
        if (error) {
          reject(error)
          return
        }
        resolve(res.body)
      }
    )
  })
  return typeof res !== 'string' || res !== `${name}@${version}`
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
              'X-Auth-Email': process.env.CF_EMAIL,
              'X-Auth-Key': process.env.CF_KEY
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
