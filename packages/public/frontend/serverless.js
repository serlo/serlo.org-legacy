const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

new http.Server((req, res) => {
  const pathname = url.parse(req.url).pathname
  const middlewares = [healthCheck, renderPage, serveAssets, page404, () => {}]
  middlewares.reduceRight((acc, cur) => () => cur(pathname, req, res, acc))()
}).listen(3000, () => console.log('Listening on http://localhost:3000'))

// middlewares
function healthCheck(pathname, req, res, next) {
  if (pathname === '/') {
    res.statusCode = 200
    return res.end(`frontend@${require('./package.json').version}`)
  }
  next()
}

function renderPage(pathname, req, res, next) {
  if (pathname.startsWith('/__')) {
    const pagePath = './.next/serverless/pages' + pathname + '.js'
    if (fs.existsSync(pagePath)) {
      return require(pagePath).render(req, res)
    }
  }
  next()
}

// maps file extension to MIME types
const map = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

// ONLY for development
function serveAssets(pathname, req, res, next) {
  if (process.env.SERVE_ASSETS === 'true') {
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext

    const filename =
      pathname.indexOf('/_next/') === 0
        ? pathname.replace('/_next/', './.next/')
        : './public' + pathname

    fs.exists(filename, function(exist) {
      if (!exist) {
        return next()
      }

      // read file from file system
      fs.readFile(filename, function(err, data) {
        if (err) {
          next()
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(data)
        }
      })
    })
  } else next()
}

function page404(pathname, req, res, next) {
  res.statusCode = 404
  res.end('Nothing to do')
}
