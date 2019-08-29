const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const webpack = require('webpack')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withCSS(
  withImages(
    withBundleAnalyzer({
      assetPrefix: 'http://localhost:3000',
      webpack: config => {
        // for multiroot support we need to overwrite one specific file
        // doing it with webpack
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /(.*)node_modules(\\|\/)next(\\|\/)dist(\\|\/)client(\\|\/)index.js/,
            function(resource) {
              resource.resource = resource.resource.replace(
                'node_modules\\next\\dist\\client\\index.js',
                'patch\\next\\dist\\client\\index.js'
              )
              resource.resource = resource.resource.replace(
                'node_modules/next/dist/client/index.js',
                'patch/next/dist/client/index.js'
              )
            }
          )
        )
        return config
      }
    })
  )
)
