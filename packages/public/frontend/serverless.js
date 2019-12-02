const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const footer = require('./.next/serverless/pages/__footer.js')
//const comments = require('./.next/serverless/pages/__comments.js')

// maps file extension to MIME types
const map = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

const server = new http.Server((req, res) => {
  // parse URL and extract path
  const pathname = url.parse(req.url).pathname

  // render page
  if (pathname === '/__footer') {
    return footer.render(req, res)
  }
  if (pathname === '/__comments') {
    return comments.render(req, res)
  }

  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext

  const filename =
    pathname.indexOf('/_next/') === 0
      ? pathname.replace('/_next/', './.next/')
      : './public' + pathname

  fs.exists(filename, function(exist) {
    if (!exist) {
      // if the file is not found, return 404
      res.statusCode = 404
      res.end(`File ${pathname} not found!`)
      return
    }

    // read file from file system
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.statusCode = 500
        res.end(`Error getting the file: ${err}.`)
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', map[ext] || 'text/plain')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(data)
      }
    })
  })
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))
