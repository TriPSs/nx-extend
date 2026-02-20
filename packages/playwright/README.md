> [!IMPORTANT]
> This package is no longer maintained in favor of @nx/playwright

# @nx-extend/playwright

<a href="https://www.npmjs.com/package/@nx-extend/playwright" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/playwright" alt="@nx-extend/playwright NPM package">
</a>

**Nx plugin for adding [Playwright](https://playwright.dev/) to your app**.

## Features

- Add Playwright E2E testing to your Nx workspace
- Integration with @nx-extend/e2e-runner for automated setup
- Support for starting services before tests

## Setup

### Install

```sh
npm install -D @nx-extend/playwright
nx g @nx-extend/playwright:init
```

## Usage

When running `nx e2e <your-project>` it will directly start Playwright. If you need to build/serve your app first, update your project targets to the following:

```json
{
  "targets": {
    "e2e": {
      "executor": "@nx-extend/e2e-runner:run",
      "options": {
        "runner": "playwright",
        "targets": [
          {
            "target": "<target to start your app>",
            "checkUrl": "<url the target will come online on>"
          }
        ]
      }
    }
  }
}
```

## Migration

This package is deprecated. Please migrate to [@nx/playwright](https://nx.dev/packages/playwright) for continued support and updates.
