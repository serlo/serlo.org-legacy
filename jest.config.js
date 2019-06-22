module.exports = {
  moduleNameMapper: {
    '\\.(mp3|ogg)$': '<rootDir>/__mocks__/sound-file-mock.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/packages/public/server']
}
