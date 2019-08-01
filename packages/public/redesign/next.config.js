const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
//

module.exports = withCSS(
  withImages(
    withBundleAnalyzer({
      assetPrefix: 'http://localhost:3000',
      webpack: config => {
        return config
      }
    })
  )
)
