const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withCSS({
  target: 'serverless',
  generateBuildId: async () =>
    process.env.BUILD_ID ? process.env.BUILD_ID : null,
  ...withImages(
    withBundleAnalyzer({
      webpack: (config, { dev, webpack }) => {
        // for multiroot support we need to overwrite one specific file
        // doing it with webpack
        const regex = /node_modules(\\|\/)next(\\|\/)dist(\\|\/)client(\\|\/)index.js/
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(regex, function(resource) {
            resource.resource = resource.resource.replace(
              regex,
              path.join(
                'packages',
                'public',
                'frontend',
                'patch',
                'next',
                'dist',
                'client',
                'index.js'
              )
            )
          })
        )
        // disable contenthashes in production build
        if (!dev) {
          config.output.chunkFilename = config.output.chunkFilename.replace(
            '.[contenthash]',
            ''
          )
          config.output.filename = () => '[name]'
        }
        // disable optimizing option to avoid this issue https://github.com/terser/terser/issues/308
        // (happens in react-mathquill)
        config.optimization.minimizer[0].options.terserOptions.compress.evaluate = false
        return config
      }
    })
  )
})
