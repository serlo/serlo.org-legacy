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
  e.respondWith(handleRequest(e.request))
})

export async function handleRequest(request: Request) {
  const response =
    (await enforceHttps(request)) ||
    (await redirects(request)) ||
    (await serloOrgProxy(request)) ||
    (await blockSerloEducation(request)) ||
    (await blockSerloDev(request)) ||
    (await semanticFileNames(request)) ||
    (await packages(request)) ||
    (await fetch(request))

  return response
}

async function enforceHttps(request: Request) {
  if (!/^http:\/\//.test(request.url)) return null
  const url = new URL(request.url)
  url.protocol = 'https'
  return Response.redirect(url.href)
}

async function redirects(request: Request) {
  const { url } = request

  if (/^https:\/\/start\.serlo\.org/.test(url)) {
    return Response.redirect(
      'https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/',
      301
    )
  }

  if (/^https:\/\/de\.serlo\.org\/labschool/.test(url)) {
    return Response.redirect('https://labschool.serlo.org', 301)
  }

  if (/^https:\/\/de\.serlo\.org\/hochschule/.test(url)) {
    return Response.redirect(
      'https://de.serlo.org/mathe/universitaet/44323',
      301
    )
  }

  if (/^https:\/\/de\.serlo\.org\/beitreten/.test(url)) {
    return Response.redirect(
      'https://docs.google.com/forms/d/e/1FAIpQLSdEoyCcDVP_G_-G_u642S768e_sxz6wO6rJ3tad4Hb9z7Slwg/viewform',
      301
    )
  }

  if (/^https:\/\/(www\.)?serlo\.org/.test(url)) {
    const newUrl = new URL(url)
    newUrl.hostname = 'de.serlo.org'
    return Response.redirect(newUrl.href)
  }

  if (/^https:\/\/stats\.serlo\.org/.test(url)) {
    const newUrl = new URL(url)
    newUrl.hostname = 'stats.serlo.dev'
    return Response.redirect(newUrl.href)
  }
}

async function serloOrgProxy(request: Request) {
  /**
   * Experiment config
   */
  /** Change cookie name when changing probability so that a new cookie is created */
  const cookieName = 'proxy-10'
  /** Probablity (0 <= p <= 1) that the legacy backend is chosen */
  const legacyProbability = 0

  enum Backend {
    legacy = 'serlo.education',
    kubernetes = 'serlo.dev'
  }

  // Routes to manually choose preferred backend
  if (request.url === 'https://de.serlo.org/experiments/enable-kubernetes') {
    const res = new Response('Set backend to kubernetes', {
      status: 200
    })
    res.headers.append(
      'Set-Cookie',
      `${cookieName}=${Backend.kubernetes}; path=/`
    )
    return res
  }
  if (request.url === 'https://de.serlo.org/experiments/disable-kubernetes') {
    const res = new Response('Set backend to legacy', {
      status: 200
    })
    res.headers.append('Set-Cookie', `${cookieName}=${Backend.legacy}; path=/`)
    return res
  }

  const match = request.url.match(/^https:\/\/(de|en|es|hi|ta|fr)\.serlo\.org/)
  if (!match) return null

  const { backend, createCookie } = chooseBackend()

  const subdomain = match[1]
  const url = new URL(request.url)
  url.hostname = `${subdomain}.${backend}`
  let response = await fetch((url as unknown) as RequestInfo, request)
  response = new Response(response.body, response)
  response.headers.set('x-backend', backend)
  if (createCookie) {
    response.headers.append('Set-Cookie', `${cookieName}=${backend}; path=/`)
  }
  return response

  function chooseBackend(): { backend: Backend; createCookie: boolean } {
    const cookie = request.headers.get('Cookie')

    if (cookie && cookie.includes(`${cookieName}=${Backend.legacy}`)) {
      return {
        backend: Backend.legacy,
        createCookie: false
      }
    }

    if (cookie && cookie.includes(`${cookieName}=${Backend.kubernetes}`)) {
      return {
        backend: Backend.kubernetes,
        createCookie: false
      }
    }

    return {
      backend:
        Math.random() < legacyProbability ? Backend.legacy : Backend.kubernetes,
      createCookie: true
    }
  }
}

async function blockSerloEducation(request: Request) {
  if (!/^https:\/\/(\w+\.)?serlo\.education/.test(request.url)) return null
  const url = request.url.replace('serlo.education/', 'serlo.org/')
  return Response.redirect(url, 301)
}

async function blockSerloDev(request: Request) {
  if (/^https:\/\/stats\.serlo\.dev/.test(request.url)) return null
  if (!/^https:\/\/(\w+\.)?serlo\.dev/.test(request.url)) return null
  const url = request.url.replace('serlo.dev/', 'serlo.org/')
  return Response.redirect(url, 301)
}

async function semanticFileNames(request: Request) {
  const { url } = request

  if (/^https:\/\/assets\.serlo\.org\/meta\//.test(url)) {
    return null
  }

  const re = /^https:\/\/assets\.serlo\.org\/(legacy\/|)((?!legacy)\w+)\/([\w\-+]+)\.(\w+)$/
  const match = url.match(re)

  if (!match) return null

  const prefix = match[1]
  const hash = match[2]
  const extension = match[4]

  return fetch(
    `https://assets\.serlo\.org/${prefix}${hash}.${extension}`,
    request
  )
}

async function packages(request: Request) {
  const match = request.url.match(/https:\/\/packages\.serlo\.org\/([^\/]+)\//)

  if (!match) return null

  const pkg = match[1]
  if (pkg === 'athene2-assets@a' || pkg === 'athene2-assets@b') return null

  const resolvedPackage = await PACKAGES_KV.get(pkg)
  if (!resolvedPackage) return

  const url = request.url.replace(pkg, resolvedPackage)
  let response = await fetch(new Request(url, request))
  response = new Response(response.body, response)
  response.headers.set('x-package', resolvedPackage)
  return response
}
