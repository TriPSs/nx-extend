import nx from '@nx/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import jsonParser from 'jsonc-eslint-parser'

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '.nx/**', '.yarn/**'] },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }]
        }
      ],
      'simple-import-sort/imports': [
        'warn',
        { groups: [['^react', '^@?\\w'], ['^.*\\u0000$'], ['^'], ['^\\.']] }
      ],
      'no-extra-semi': 'off',
      '@stylistic/no-extra-semi': 'error'
    }
  },
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsonParser }
  }
]
