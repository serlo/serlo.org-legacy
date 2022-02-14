const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, 'src', 'main'),
    'legacy-editor': path.join(__dirname, 'src', 'legacy-editor'),
  },
  output: {
    chunkFilename: '[name].[chunkhash:8].js',
    assetModuleFilename: '[name].[contenthash:8].[ext]',
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
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  target: 'web',
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: '[id].[chunkhash:8].css',
      filename: '[name].css',
    }),
  ],
}
