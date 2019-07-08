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
import * as R from 'ramda'
import * as semver from 'semver'

export function buildDockerImage({
  name,
  version,
  Dockerfile,
  context
}: DockerImageOptions) {
  if (!semver.valid(version)) {
    return
  }

  spawnSync(
    'docker',
    [
      'build',
      '-f',
      Dockerfile,
      ...R.flatten<string>(
        getTags(version).map(tag => ['-t', `${name}:${tag}`])
      ),
      context
    ],
    {
      stdio: 'inherit'
    }
  )
}

export function publishDockerImage(options: DockerImageOptions) {
  const { name, version } = options
  buildDockerImage(options)

  const remoteTags = R.map(
    tag => `eu.gcr.io/serlo-shared/${name}:${tag}`,
    getTags(version)
  )
  remoteTags.forEach(remoteTag => {
    console.log('Pushing', remoteTag)
    spawnSync('docker', ['tag', `${name}:latest`, remoteTag], {
      stdio: 'inherit'
    })
    spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
  })
}

function getTags(version: string) {
  return [
    'latest',
    semver.major(version),
    `${semver.major(version)}.${semver.minor(version)}`,
    `${semver.major(version)}.${semver.minor(version)}.${semver.patch(version)}`
  ]
}

export interface DockerImageOptions {
  name: string
  version: string
  Dockerfile: string
  context: string
}
