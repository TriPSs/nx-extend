# @nx-extend/playwright

<a href="https://www.npmjs.com/package/@nx-extend/playwright" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/playwright" alt="@nx-extend/playwright NPM package">
</a>

**Nx plugin for adding [Playwright](https://playwright.dev/) to your app**.

## Setup

### Install

```sh
npm install -D @nx-extend/playwright
nx g @nx-extend/playwright:init
```

## Usage

When running `nx e2e <your-project>` it will directly start Playwright, if you need to build/server your app first
Update your project targets to the following

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
