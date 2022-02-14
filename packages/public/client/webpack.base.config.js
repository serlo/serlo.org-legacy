const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { WebpackDeduplicationPlugin } = require('webpack-deduplication-plugin')

module.exports = {
  entry: {
    main: path.join(__dirname, 'src', 'main'),
    'legacy-editor': path.join(__dirname, 'src', 'legacy-editor'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          rootMode: 'upward',
        },
      },
      {
        test: /\.mjs$/,
        resolve: {
          mainFields: ['module', 'main'],
        },
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(s?css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp3|ogg)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  target: 'web',
  externals: [require('webpack-require-http')],
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: '[id].[chunkhash:8].css',
      filename: '[name].css',
    }),
    new WebpackDeduplicationPlugin({}),
  ],
  node: {
    Buffer: false,
    process: false,
  },
}
