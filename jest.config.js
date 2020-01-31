module.exports = {
  moduleNameMapper: {
    '\\.(mp3|ogg)$': '<rootDir>/__mocks__/sound-file-mock.js'
  },
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime.js'],
  watchPathIgnorePatterns: ['pacts']
}
