const assetPrefix = process.env.ASSET_PREFIX || ''

export function getPath(path) {
  return assetPrefix + path
}
