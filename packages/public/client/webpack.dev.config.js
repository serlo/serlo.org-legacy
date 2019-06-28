const R = require('ramda')

const baseConfig = require('./webpack.base.config')
const port = 8081

module.exports = R.mergeDeepRight(baseConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${port}/`
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    // workaround for https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',
    port,
    stats: 'errors-only'
  }
})
