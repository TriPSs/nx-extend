const nxPreset = require('@nx/jest/preset').default

const esmPackages = [
  '@actions',
]

module.exports = {
  ...nxPreset,
  testTimeout: 350_000,
  maxWorkers: 1,
  testEnvironment: 'node',
  watchman: false,

  transformIgnorePatterns: [`node_modules/(?!(${esmPackages.join('|')})/)`]
}
