# @nx-extend/gcp-functions

<a href="https://www.npmjs.com/package/@nx-extend/gcp-functions" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-functions" alt="@nx-extend/gcp-functions NPM package">
</a>

**Nx plugin to build and deploy your [Google Cloud Functions](https://cloud.google.com/functions)**.

## Features

- Deploy functions to Google Cloud Functions
- Support for multiple trigger types (HTTP, Pub/Sub, Storage, etc.)
- Local development runner for testing multiple functions
- Configurable memory, timeout, and concurrency settings
- Environment variable and secret management
- VPC connector support

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-functions
nx g @nx-extend/gcp-functions:init
```

## Usage

### Deploy

Deploy a function to Google Cloud:

```sh
nx deploy <function-name>
```

#### Available options:

| Name                         | Type               | Default         | Description                                                    |
|------------------------------|--------------------|-----------------|----------------------------------------------------------------|
| **`functionName`**           | `string`           | -               | Name of the function                                           |
| **`entryPoint`**             | `string`           | `functionName`  | Entrypoint of the file to use                                  |
| **`trigger`**                | `string`           | -               | Trigger type: `http`, `bucket`, `topic`, `resource`, `event`   |
| **`triggerValue`**           | `string`           | -               | Value of the trigger (bucket name, topic name, etc.)           |
| **`runtime`**                | `string`           | `recommended`   | Runtime: `nodejs16`, `nodejs18`, `nodejs20`, `nodejs22`, `nodejs24`, `recommended` |
| **`memory`**                 | `string`           | -               | Memory: `128MB`, `256MB`, `512MB`, `1024MB`, `2048MB`, `4096MB`, `8192MB`, `16384MB`, `32768MB` |
| **`allowUnauthenticated`**   | `boolean`          | -               | Whether to allow unauthenticated requests                      |
| **`maxInstances`**           | `number`           | -               | Maximum number of function instances                           |
| **`envVarsFile`**            | `string`           | -               | Path to environment variables file                             |
| **`envVars`**                | `object`           | -               | Environment variables object                                   |
| **`project`**                | `string`           | -               | GCP project to deploy to                                       |
| **`retry`**                  | `boolean`          | `false`         | Enable retry on failure                                        |
| **`ingressSettings`**        | `string`           | -               | Ingress settings: `all`, `internal-only`, `internal-and-gclb`  |
| **`egressSettings`**         | `string`           | -               | Egress settings: `all`, `private-ranges-only`                  |
| **`vpcConnector`**           | `string`           | -               | VPC connector name                                             |
| **`securityLevel`**          | `string`           | -               | Security level: `secure-optional`, `secure-always`             |
| **`gen`**                    | `number`           | `2`             | Cloud Functions generation (1 or 2)                            |
| **`cpu`**                    | `number`           | `1`             | Number of CPUs                                                 |
| **`concurrency`**            | `number`           | `1`             | Maximum concurrent requests per instance                       |
| **`timeout`**                | `number`           | -               | Function timeout in seconds                                    |
| **`secrets`**                | `array` or `object`| -               | Secrets to mount into the function                             |

### Build

Build a function locally:

```sh
nx build <function-name>
```

## Runner

This project includes a runner to run all your functions locally for development. To generate the runner:

```sh
nx g @nx-extend/gcp-functions:init-runner <name>
```

This will generate a `main.ts` file like this:

```ts
import { bootstrapRunner } from '@nx-extend/gcp-functions/runner'

/* eslint-disable @nx/enforce-module-boundaries */
bootstrapRunner(new Map([
    ['nx function project name', import('path to main of project')]
  ])
)
```

You can now add all your functions to the map. Make sure that the `nx function project name` is the same name as known by Nx (`name` prop of that function's `project.json`). The runner uses the `deploy` target of that `project.json` to determine how to serve the function (HTTP/Pub Sub/bucket event).

## Examples

### HTTP Function

```json
{
  "deploy": {
    "executor": "@nx-extend/gcp-functions:deploy",
    "options": {
      "functionName": "myHttpFunction",
      "trigger": "http",
      "runtime": "nodejs20",
      "memory": "256MB"
    }
  }
}
```

### Pub/Sub Function

```json
{
  "deploy": {
    "executor": "@nx-extend/gcp-functions:deploy",
    "options": {
      "functionName": "myPubSubFunction",
      "trigger": "topic",
      "triggerValue": "my-topic",
      "runtime": "nodejs20"
    }
  }
}
```

### Storage Function

```json
{
  "deploy": {
    "executor": "@nx-extend/gcp-functions:deploy",
    "options": {
      "functionName": "myStorageFunction",
      "trigger": "bucket",
      "triggerValue": "my-bucket",
      "runtime": "nodejs20"
    }
  }
}
```
