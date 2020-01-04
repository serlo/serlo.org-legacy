const lib = require('./lib')

lib
  .createServer([lib.healthCheck, lib.renderPage, serveAssets, lib.page404])
  .listen(3000, () =>
    console.log('Frontend (development) on http://localhost:3000')
  )

// ONLY for development: serve static assets
const fs = require('fs')
const path = require('path')

// maps file extension to MIME types
const map = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

function serveAssets(pathname, req, res, next) {
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
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
}
