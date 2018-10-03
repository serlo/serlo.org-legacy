const R = require('ramda')

const baseConfig = require('./webpack.main.base.config')

module.exports = R.mergeDeepRight(baseConfig, {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8081/'
  },
  devtool: 'cheap-module-source-map'
})
