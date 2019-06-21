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
addEventListener('fetch', (event: Event) => {
  const e = event as FetchEvent
  const req = enforceHttps(e.request)
  e.respondWith(handleRequest(req))
})

export async function handleRequest(request: Request) {
  const response =
    (await redirects(request)) ||
    (await serloOrgProxy(request)) ||
    (await blockSerloEducation(request)) ||
    (await semanticFileNames(request)) ||
    (await fetch(request))

  return response
}

async function redirects(request: Request) {
  const { url } = request

  if (/^https:\/\/start\.serlo\.org/.test(url)) {
    return Response.redirect(
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/'
    )
  }

  if (/^https:\/\/de\.serlo\.org\/labschool/.test(url)) {
    return Response.redirect('https://labschool.serlo.org')
  }

  if (/^https:\/\/de\.serlo\.org\/hochschule/.test(url)) {
    return Response.redirect('https://de.serlo.org/mathe/universitaet/44323')
  }

  if (/^https:\/\/de\.serlo\.org\/beitreten/.test(url)) {
    return Response.redirect(
      'https://docs.google.com/forms/d/e/1FAIpQLSdEoyCcDVP_G_-G_u642S768e_sxz6wO6rJ3tad4Hb9z7Slwg/viewform'
    )
  }

  if (/^https:\/\/(www\.)?serlo\.org/.test(url)) {
    const newUrl = new URL(url)
    newUrl.hostname = 'de.serlo.org'
    return Response.redirect(newUrl.href)
  }
}

async function serloOrgProxy(request: Request) {
  const match = request.url.match(/^https:\/\/(de|en|es|hi)\.serlo\.org/)
  if (!match) return null
  const subdomain = match[1]
  const url = new URL(request.url)
  url.hostname = `${subdomain}.serlo.education`
  let response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.set('x-backend', 'serlo.education')
  return response
}

async function blockSerloEducation(request: Request) {
  const { url } = request

  if (!/^https:\/\/(\w+\.)?serlo\.education/.test(url)) return null
  return new Response('You may not access this page directly', {
    status: 403,
    statusText: 'Forbidden'
  })
}

async function semanticFileNames(request: Request) {
  const { url } = request

  if (/^https:\/\/assets\.serlo\.org\/meta\//.test(url)) {
    return null
  }

  const re = /^https:\/\/assets\.serlo\.org\/(legacy\/|)((?!legacy)\w+)\/([\w\-+]+)\.(\w+)$/
  const match = url.match(re)

  if (!match) {
    return null
  }

  const prefix = match[1]
  const hash = match[2]
  const extension = match[4]

  return fetch(
    `https://assets\.serlo\.org/${prefix}${hash}.${extension}`,
    request
  )
}

function enforceHttps(request: Request): Request {
  if (!/^http:\/\//.test(request.url)) return request
  const url = new URL(request.url)
  url.protocol = 'https'
  return new Request((url as unknown) as RequestInfo, request)
}
