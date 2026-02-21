# @nx-extend/e2e-runner

<a href="https://www.npmjs.com/package/@nx-extend/e2e-runner" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/e2e-runner" alt="@nx-extend/e2e-runner NPM package">
</a>

**Nx plugin to start your API and then run the Cypress/Playwright E2E tests**.

## Features

- Start multiple targets before running tests
- Health check URLs to ensure targets are ready
- Support for Cypress, Playwright, and custom runners
- Configurable retry attempts for health checks
- Optional log forwarding from targets
- Reuse existing servers option

## Setup

### Install

```sh
npm install -D @nx-extend/e2e-runner
nx g @nx-extend/e2e-runner:add
```

## Usage

### Available Options

All options of the specified runner are available:
- `@nrwl/cypress:cypress` options (if `runner = cypress`)
- `@nx-extend/playwright:test` options (if `runner = playwright`)
- `@nx/playwright` options (if `runner = @nx/playwright`)
- `@nx/workspace:run-commands` options (if `runner = run-commands`)

### Target Configuration

The `targets` option is used to define targets that should be started before running the tests. Each target can be configured with the following options:

```ts
{
  target: string // The target to run.
  checkUrl?: string // The url to check if the target is "live", a target is live if this url returns a status-code in the 200 range.
  checkMaxTries?: number // The amount of times the `checkUrl` is tried before failing, there is a two second delay between tries.
  env?: { [key: string]: string } // Extra parameters provided to the target on startup.
  reuseExistingServer?: boolean // Set to true to allow using a previously started target.
  rejectUnauthorized?: boolean // Set to false to allow the use of self-signed certificates in your target.
  logging?: boolean // Set to true to forwards the logs of the target, set to false to hide the logs of the target. When undefined, the logs are only forwarded with the `--verbose` flag.
}
```

## Example Configuration

```json
{
  "e2e": {
    "executor": "@nx-extend/e2e-runner:run",
    "options": {
      "runner": "playwright",
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
          "checkMaxTries": 50,
          "logging": false
        }
      ]
    }
  }
}
```

## How It Works

1. The executor starts all configured targets in parallel
2. For each target with a `checkUrl`, it performs health checks
3. Once all targets are healthy (or max tries reached), the E2E tests run
4. After tests complete, all started targets are terminated
