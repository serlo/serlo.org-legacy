const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const R = require('ramda')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const baseConfig = require('./webpack.base.config')

const baseDir = path.join(__dirname, '..', '..', '..')

module.exports = R.merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  output: {
    ...baseConfig.output,
    devtoolModuleFilenameTemplate(info) {
      const relativePath = path.relative(baseDir, info.absoluteResourcePath)
      return `webpack:///${relativePath}`
    }
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        parallel: true
      })
    ]
  }
})
