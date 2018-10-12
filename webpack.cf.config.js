const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'cloudflare-workers'),
  output: {
    path: path.resolve(__dirname, 'dist-cf'),
    filename: 'index.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  target: 'webworker'
}
