module.exports = {
  name: 'functions-contact-form',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testMatch: ['**/+(*.)+(spec|test|e2e).+(ts|js|e2e)?(x)'],
  moduleFileExtensions: ['ts'],
  coverageDirectory: '../../../coverage/apps/demo-app',
}
