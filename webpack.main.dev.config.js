const R = require('ramda')

const baseConfig = require('./webpack.main.base.config')
const port = 8081

module.exports = R.mergeDeepRight(baseConfig, {
  mode: 'development',
  output: {
    publicPath: `http://localhost:${port}/`
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port
  }
})
