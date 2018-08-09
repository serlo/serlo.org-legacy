const path = require('path')

module.exports = {
  target: 'webworker',
  entry: './src/cloudflare-workers',
  output: {
    path: path.resolve(__dirname, 'dist-cf'),
    filename: 'index.js',
    publicPath: '/'
  }
}
