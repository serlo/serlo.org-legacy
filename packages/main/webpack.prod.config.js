const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const R = require('ramda')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

const baseConfig = require('./webpack.base.config')

module.exports = R.merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  }
})
