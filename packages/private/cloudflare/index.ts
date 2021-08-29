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
import fetch from 'node-fetch'

const accountId = '3bfabc4463c2c3c340f7301d22ed18c0'
const packageKVNamespace = '19f90dc8e6ff49cd8bc42f51346409be'

export async function shouldDeployPackage({
  name,
  version,
}: {
  name: string
  version: string
}) {
  if (process.env.DEPLOY !== 'true') return false

  const target = `${name}@${version}`
  const response = await getCloudflarePackageValue({ key: target })
  return (await response.text()) !== target
}

export async function publishPackage({
  name,
  version,
}: {
  name: string
  version: string
}) {
  await Promise.all(
    getEnvironments().map((env) =>
      setCloudflarePackageValue({
        key: `${name}@${env}`,
        value: `${name}@${version}`,
      })
    )
  )

  function getEnvironments() {
    const [major, minor, patch] = version.split('.')
    return [
      ...(!patch.includes('-') ? [major, `${major}.${minor}`] : []),
      version,
    ]
  }
}

async function getCloudflarePackageValue(args: { key: string }) {
  return await makeCloudflareApiCall(args)
}

async function setCloudflarePackageValue(args: { key: string; value: string }) {
  return await makeCloudflareApiCall(args)
}

async function makeCloudflareApiCall({
  key,
  value,
}: {
  key: string
  value?: string
}) {
  const auth_email = process.env.CF_EMAIL
  const auth_key = process.env.CF_KEY

  if (!auth_email) throw new Error('env variable CF_EMAIL needs to be set')
  if (!auth_key) throw new Error('env variable CF_KEY needs to be set')

  const url =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}` +
    `/storage/kv/namespaces/${packageKVNamespace}/values/${key}`

  return fetch(url, {
    headers: { 'X-Auth-Email': auth_email, 'X-Auth-Key': auth_key },
    ...(value ? { body: value } : {}),
  })
}
