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
import { spawnSync } from 'child_process'
import * as semver from 'semver'

export function buildDockerImage(name: string, version: string) {
  if (!semver.valid(version)) {
    return
  }

  const tag = `${name}:${semver.major(version)}`
  spawnSync(
    'docker',
    ['build', '-f', 'docker/httpd/Dockerfile', '-t', tag, '.'],
    { stdio: 'inherit' }
  )

  if (
    !process.env.CI ||
    !process.env.CIRCLE_BRANCH ||
    process.env.CIRCLE_BRANCH !== 'master'
  ) {
    return
  }

  const remoteTags = [
    `eu.gcr.io/serlo-containers/${name}:latest`,
    `eu.gcr.io/serlo-containers/${name}:${semver.major(version)}`,
    `eu.gcr.io/serlo-containers/${name}:${semver.major(version)}.${semver.minor(
      version
    )}`,
    `eu.gcr.io/serlo-containers/${name}:${semver.major(version)}.${semver.minor(
      version
    )}.${semver.patch(version)}`
  ]
  remoteTags.forEach(remoteTag => {
    spawnSync('docker', ['tag', tag, remoteTag], { stdio: 'inherit' })
    spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
  })
}
