const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const webpack = require('webpack')
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withCSS(
  withImages(
    withBundleAnalyzer({
      assetPrefix: process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX : '',
      webpack: config => {
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
                'redesign',
                'patch',
                'next',
                'dist',
                'client',
                'index.js'
              )
            )
          })
        )
        return config
      }
    })
  )
)
