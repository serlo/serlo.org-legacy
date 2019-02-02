/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

export async function handleRequest(request) {
  const response =
    (await handleRedirects(request)) ||
    (await handleSemanticAssetsFilenames(request)) ||
    (await fetch(request))

  return response
}

async function handleRedirects(request) {
  const { url } = request

  if (/^https?:\/\/start.serlo.org/.test(url)) {
    return Response.redirect(
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/'
    )
  }
}

async function handleSemanticAssetsFilenames(request) {
  const { url } = request

  if (/^https:\/\/assets.serlo.org\/meta\//.test(url)) {
    return null
  }

  const re = /^https:\/\/assets.serlo.org\/(legacy\/|)((?!legacy)\w+)\/([\w\-+]+)\.(\w+)$/
  const match = url.match(re)

  if (!match) {
    return null
  }

  const prefix = match[1]
  const hash = match[2]
  const extension = match[4]

  return fetch(
    `https://assets.serlo.org/${prefix}${hash}.${extension}`,
    request
  )
}
