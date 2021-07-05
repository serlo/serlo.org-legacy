module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(mp3|ogg)$': '<rootDir>/__mocks__/sound-file-mock.js',
  },
}
