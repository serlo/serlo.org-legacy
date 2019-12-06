const lib = require('./lib')

lib
  .createServer([lib.healthCheck, lib.renderPage, lib.page404])
  .listen(3000, () =>
    console.log('Frontend (production) on http://localhost:3000')
  )
