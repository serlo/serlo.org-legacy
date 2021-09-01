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
import * as R from 'ramda'
import * as semver from 'semver'
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
  const semanticVersion = semver.parse(version)

  if (semanticVersion === null) throw new Error(`illegal version ${version}`)

  await Promise.all(
    getTargetVersions(semanticVersion).map((env) =>
      setCloudflarePackageValue({
        key: `${name}@${env}`,
        value: `${name}@${version}`,
      })
    )
  )

  function getTargetVersions(version: semver.SemVer) {
    const { major, minor, patch, prerelease } = version

    return !prerelease
      ? [`${major}`, `${major}.${minor}`, `${major}.${minor}.${patch}`]
      : R.range(1, prerelease.length).map(
          (i) =>
            `${major}.${minor}.${patch}-${prerelease.slice(0, i).join('.')}`
        )
  }
}

async function getCloudflarePackageValue({ key }: { key: string }) {
  const response = await makeCloudflareApiCall({ key })

  if (response.status !== 200 && response.status !== 404) {
    throw new Error(`CF: error getting "${key}": ${await response.text()}`)
  }

  return response
}

async function setCloudflarePackageValue({
  key,
  value,
}: {
  key: string
  value: string
}) {
  const response = await makeCloudflareApiCall({ key, value })

  if (response.status !== 200) {
    const error = await response.text()
    throw new Error(`CF: error setting "${key}" to "${value}": ${error}`)
  }

  return response
}

async function makeCloudflareApiCall({
  key,
  value,
}: {
  key: string
  value?: string
}) {
  const auth_key = process.env.CF_KEY

  if (!auth_key) throw new Error('env variable CF_KEY needs to be set')

  const url =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}` +
    `/storage/kv/namespaces/${packageKVNamespace}/values/${key}`

  return fetch(url, {
    method: value ? 'PUT' : 'GET',
    headers: { Authorization: `Bearer ${auth_key}` },
    ...(value ? { body: value } : {}),
  })
}
