/* eslint-disable */
export default {
  displayName: 'actions-plan',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    '^.+\\.[cm]?jsx?$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/../../node_modules/@actions/core/lib/core.js'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'],
  coverageDirectory: '../../coverage/actions/plan',
  testEnvironment: 'node'
}
