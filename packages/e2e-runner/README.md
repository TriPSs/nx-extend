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
> All options of @nrwl/workspace:run-commands are available here if runner = run-commands


### Target options:
The `targets` option is used to define targets that should be started before running the tests.
Each target can be configured with the following options.

```typescript
{
  target: string // The target to run.
  checkUrl?: string // The url to check if the target is "live", a target is live if this url returns a status-code in the 200 range.
  checkMaxTries?: number // The amount of times the `checkUrl` is tried before failing, there is a two second delay between tries.
  env?: { [key: string]: string } // Extra parameters provided to the target on startup.
  reuseExistingServer?: boolean // Set to true to allow using a previously started target.
  rejectUnauthorized?: boolean // Set to false to allow the use of self-signed certificates in your target.
}
```

Example target

```json
{
  ...
  "e2e": {
    "executor": "@nx-extend/e2e-runner:run",
    "options": {
      "runner": "playwright | cypress | run-commands",
      "targets": [
        {
          "target": "app:serve",
          "checkUrl": "http://localhost:4200/",
          "checkMaxTries": 50,
          "rejectUnauthorized": true
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
