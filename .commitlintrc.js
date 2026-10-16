const { existsSync, readdirSync, readFileSync } = require('node:fs')
const { join } = require('node:path')

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))
const scopes = []

for (const directory of ['packages', 'actions']) {
  for (const entry of readdirSync(join(__dirname, directory), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const root = join(__dirname, directory, entry.name)
    const manifest = ['package.json', 'project.json'].find((file) => existsSync(join(root, file)))
    if (manifest) scopes.push(readJson(join(root, manifest)).name.replace(/^@nx-extend\//, ''))
  }
}

module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'subject-case': [2, 'always', 'sentence-case'],
    'type-enum': [
      2,
      'always',
      [
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'test',
        'wip',
        'chore'
      ]
    ],
    'scope-enum': [2, 'always', scopes]
  }
}
