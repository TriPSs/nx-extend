# @nx-extend/gcp-deployment-manager

<a href="https://www.npmjs.com/package/@nx-extend/gcp-deployment-manager" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-deployment-manager" alt="@nx-extend/gcp-deployment-manager NPM package">
</a>

**Nx plugin for deploy your app to [Cloud Run](https://cloud.google.com/run)**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-deployment-manager
nx g @nx-extend/gcp-deployment-manager:init
```

## Usage

### Create

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| **`--project`** | `string` | | GCP project to deploy to|
| **`--file`** | `string` | `null` | file from source to create |

### Update

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| **`--project`** | `string` | | GCP project to deploy to|
| **`--file`** | `string` | `null` | file from source to update |

### Delete

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| **`--project`** | `string` | | GCP project to deploy to|
| **`--file`** | `string` | `null` | file from source to delete |
