const http = require('http')
const next = require('next')

const app = next({})
const srv = http.createServer(app.getRequestHandler())

// setting CORS-Headers for static assets
srv.on('request', (req, res) => {
  if (req.url.startsWith('/static/')) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
})

srv.on('listening', () => {
  console.log(`> Ready on http://localhost:3000`)
})

srv.on('error', err => {
  console.log(err)
  process.exit(1)
})

app.prepare().then(() => {
  srv.listen(3000, 'localhost')
})
