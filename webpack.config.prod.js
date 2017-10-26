const ExtractTextPlugin = require('extract-text-webpack-plugin')
const R = require('ramda')

const baseConfig = require('./webpack.config.base')

module.exports = R.merge(baseConfig, {
  devtool: 'source-map',
  plugins: R.concat(baseConfig.plugins, [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
  ])
})
