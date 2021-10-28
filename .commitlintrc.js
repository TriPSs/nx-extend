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
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'firebase-hosting',
        'gcp-cloud-run',
        'gcp-deployment-manager',
        'gcp-functions',
        'gcp-secrets',
        'gcp-storage',
        'translations',
        'strapi'
      ]
    ]
  }
}
