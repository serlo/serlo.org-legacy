const path = require('path')
const createNodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'ory-editor', 'index.gcf'),
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
        loader: require.resolve('babel-loader')
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  target: 'node',
  externals: [createNodeExternals()]
}
