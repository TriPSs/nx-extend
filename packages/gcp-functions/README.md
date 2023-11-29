# @nx-extend/gcp-functions

<a href="https://www.npmjs.com/package/@nx-extend/gcp-functions" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-functions" alt="@nx-extend/gcp-functions NPM package">
</a>

**Nx plugin to build and deploy your [Google Cloud Functions](https://cloud.google.com/functions)**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-functions
nx g @nx-extend/gcp-functions:init
```

## Usage

### Deploy

#### Available options:

| name | type | default | description |
|------|------|---------|-------------|

## Runner
This projects includes a runner to run all your functions, to generate the runner:
```sh
nx g @nx-extend/gcp-functions:init-runner <name>
```

This will generate a `main.ts` file like this:
```ts
import { bootstrapRunner } from '@nx-extend/gcp-functions/runner'

/* eslint-disable @nx/enforce-module-boundaries */
bootstrapRunner(new Map([
    ['nx function project name', import('path to main of of project')]
  ])
)
```

You can now add all your functions to the map, **note:** make sure that the `nx function project name` is the same name as
known by Nx (`name` prop of that functions `project.json`). The runner uses the `deploy` target of that `project.json` to determine
how to serve the function (http/pub sub/bucket event).
