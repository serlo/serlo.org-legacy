const ExtractTextPlugin = require('extract-text-webpack-plugin')
const R = require('ramda')

const baseConfig = require('./webpack.config.base')

module.exports = R.mergeDeepRight(baseConfig, {
  devtool: 'cheap-module-source-map',
  output: {
    publicPath: 'http://localhost:8081/'
  },
  plugins: R.concat(baseConfig.plugins, [
    new ExtractTextPlugin({ disable: true, allChunks: true })
  ])
})
