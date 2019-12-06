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
