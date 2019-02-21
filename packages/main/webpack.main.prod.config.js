const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const R = require('ramda')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const baseConfig = require('./webpack.main.base.config')

module.exports = R.merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  }
})
