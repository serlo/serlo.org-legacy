const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const page = require('./.next/serverless/pages/__footer.js')
const server = new http.Server((req, res) => {
  // parse URL
  const parsedUrl = url.parse(req.url)
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`
  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(pathname).ext
  // maps file extention to MIME typere
  const map = {
    '.js': 'text/javascript',
    '.css': 'text/css'
  }
  if (pathname.indexOf('./_next/') === 0) {
    pathname = pathname.replace('./_next/', './.next/')
    fs.exists(pathname, function(exist) {
      if (!exist) {
        // if the file is not found, return 404
        res.statusCode = 404
        res.end(`File ${pathname} not found!`)
        return
      }

      // if is a directory search for index file matching the extention
      if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext

      // read file from file system
      fs.readFile(pathname, function(err, data) {
        if (err) {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain')
          res.end(data)
        }
      })
    })
  } else page.render(req, res)
})
server.listen(3000, () => console.log('Listening on http://localhost:3000'))

/*

const http = require('http');
const port = process.argv[2] || 9000;

http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);






}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);

*/
