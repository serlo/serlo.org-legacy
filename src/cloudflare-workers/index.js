/* eslint-env browser, serviceworker */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

export async function handleRequest (request) {
  const response =
    (await handleSemanticAssetsFilenames(request)) || (await fetch(request))

  return response
}

async function handleSemanticAssetsFilenames (request) {
  const re = /^https:\/\/assets.serlo.org\/(legacy\/|)((?!legacy)\w+)\/([\w\-+]+)\.(\w+)$/
  const match = request.url.match(re)

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
