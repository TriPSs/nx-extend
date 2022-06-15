# @nx-extend/e2e-runner

<a href="https://www.npmjs.com/package/@nx-extend/e2e-runner" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/e2e-runner" alt="@nx-extend/e2e-runner NPM package">
</a>

**Nx plugin to start your API and then run the Cypress E2E tests**.

## Setup

### Install

```sh
npm install -D @nx-extend/e2e-runner
nx g @nx-extend/e2e-runner:add
```

## Usage

### Run

#### Available options:

> All options of @nrwl/cypress:cypress are available here

| name                   | type     | default | description                                               |
|------------------------|----------|---------|-----------------------------------------------------------|
| **`--serverTarget`**   | `string` |         | target of the server to start beforing triggering cypress |
| **`--serverCheckUrl`** | `string` |         | url to validate of the server is started                  |


## Update the server project

Update the bootstrap file with the following code at the bottom to make sure the server stops after the tests are done

```typescript
if (process.env.NX_TASK_TARGET_PROJECT === '<project name>-e2e') {
  process.on('disconnect', async () => {
    process.exit(0)
  })
}
```
