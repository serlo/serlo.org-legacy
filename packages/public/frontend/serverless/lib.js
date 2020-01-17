/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

function createServer(middlewares) {
  return new http.Server((req, res) => {
    const pathname = url.parse(req.url).pathname
    middlewares.reduceRight(
      (acc, cur) => () => cur(pathname, req, res, acc),
      () => {}
    )()
  })
}

// middlewares
function healthCheck(pathname, req, res, next) {
  if (pathname === '/') {
    res.statusCode = 200
    return res.end(`frontend@${require('../package.json').version}`)
  }
  next()
}

function renderPage(pathname, req, res, next) {
  if (pathname.startsWith('/__')) {
    const pagePath = '../.next/serverless/pages' + pathname + '.js'
    if (fs.existsSync(path.join(__dirname, pagePath))) {
      return require(pagePath).render(req, res)
    }
  }
  next()
}

function page404(pathname, req, res, next) {
  res.statusCode = 404
  res.end('Nothing to do')
}

module.exports = { createServer, healthCheck, renderPage, page404 }
