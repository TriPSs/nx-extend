# @nx-extend/e2e-runner

<a href="https://www.npmjs.com/package/@nx-extend/e2e-runner" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/e2e-runner" alt="@nx-extend/e2e-runner NPM package">
</a>

**Nx plugin to start your API and then run the Cypress/Playwright E2E tests**.

## Setup

### Install

```sh
npm install -D @nx-extend/e2e-runner
nx g @nx-extend/e2e-runner:add
```

#### Available options:

> All options of @nrwl/cypress:cypress are available here if runner = cypress
> All options of @nx-extend/playwright:test are available here if runner = playwright

Example target

```json
{
  ...
  "e2e": {
    "executor": "@nx-extend/e2e-runner:run",
    "options": {
      "runner": "playwright | cypress",
      "targets": [
        {
          "target": "app:serve",
          "checkUrl": "http://localhost:4200/",
          "checkMaxTries": 50
        },
        {
          "target": "api:serve",
          "checkUrl": "http://localhost:9000/health",
          "checkMaxTries": 50
        }
      ]
    }
  }
}
```
