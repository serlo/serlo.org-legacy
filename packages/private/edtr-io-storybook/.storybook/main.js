module.exports = {
  stories: ['../__stories__/*.@(ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-knobs'],
  async webpackFinal(config) {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        rootMode: 'upward',
      },
    })
    config.devServer = {
      stats: 'errors-only',
    }
    return config
  },
}
