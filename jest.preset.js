const nxPreset = require('@nx/jest/preset').default

module.exports = {
  ...nxPreset,
  testTimeout: 350_000,
  maxWorkers: 1,
  testEnvironment: 'node'
}
