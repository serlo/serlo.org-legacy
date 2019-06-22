const path = require('path')
const webpack = require('webpack')
const createNodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.gcf'),
  output: {
    path: path.resolve(__dirname, 'dist-gcf'),
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          rootMode: 'upward'
        }
      },
      {
        test: /\.mjs$/,
        resolve: {
          mainFields: ['module', 'main']
        },
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  target: 'node',
  externals: [createNodeExternals(), require('webpack-require-http')]
}
