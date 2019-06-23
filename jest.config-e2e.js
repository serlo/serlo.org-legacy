const { mergeDeepRight } = require('ramda')

const puppeteerPreset = require('jest-puppeteer/jest-preset')
const tsPreset = require('ts-jest/jest-preset')

module.exports = {
  ...mergeDeepRight(puppeteerPreset, tsPreset),
  testRegex: '/packages/public/server/__tests__/'
}
