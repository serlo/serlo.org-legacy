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
import { spawnSync } from 'child_process'
import * as R from 'ramda'
import * as semver from 'semver'

export function buildDockerImage({
  name,
  version,
  Dockerfile,
  context,
}: {
  name: string
  version: string
  Dockerfile: string
  context: string
}) {
  const semanticVersion = semver.parse(version)

  if (!semanticVersion) {
    throw new Error(`illegal version number ${version}`)
  }

  const remoteName = `eu.gcr.io/serlo-shared/${name}`

  if (!shouldBuild()) {
    console.log(
      `Skipping deployment: ${remoteName}:${version} already in registry`
    )
    return
  }

  const tags = Array.from(getTags(semanticVersion)).map((t) => t.toString())

  runBuild(tags)
  pushTags(tags)

  function shouldBuild() {
    const args = [
      'container',
      'images',
      'list-tags',
      remoteName,
      '--filter',
      `tags=${version}`,
      '--format',
      'json',
    ]

    const result = spawnSync('gcloud', args, { stdio: 'pipe' })
    const images = JSON.parse(String(result.stdout))

    return images.length === 0
  }

  function runBuild(tags: string[]) {
    const args = [
      'build',
      '-f',
      Dockerfile,
      ...R.flatten(tags.map((tag) => ['-t', `${name}:${tag}`])),
      context,
    ]
    const result = spawnSync('docker', args, { stdio: 'inherit' })

    if (result.status !== 0) throw new Error(`Error while building ${name}`)
  }

  function pushTags(tags: string[]) {
    const remoteTags = tags.map((tag) => `${remoteName}:${tag}`)
    remoteTags.forEach((remoteTag) => {
      console.log('Pushing', remoteTag)
      spawnSync('docker', ['tag', `${name}:latest`, remoteTag], {
        stdio: 'inherit',
      })
      spawnSync('docker', ['push', remoteTag], { stdio: 'inherit' })
    })
  }
}

function* getTags(version: semver.SemVer) {
  const { major, minor, patch, prerelease } = version

  if (!prerelease) {
    yield 'latest'
    yield `${major}`
    yield `${major}.${minor}`
    yield `${major}.${minor}.${patch}`
  } else {
    for (let i = 1; i <= prerelease.length; i++) {
      yield `${major}.${minor}.${patch}-${prerelease.slice(0, i).join('.')}`
    }
  }
}
