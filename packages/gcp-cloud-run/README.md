# @nx-extend/gcp-cloud-run

<a href="https://www.npmjs.com/package/@nx-extend/gcp-cloud-run" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-cloud-run" alt="@nx-extend/gcp-cloud-run NPM package">
</a>

**Nx plugin for deploy your app to [Cloud Run](https://cloud.google.com/run)**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-cloud-run
```

## Usage

### Deploy

#### Available options:

| name                         | type      | default          | description                                          |
|------------------------------|-----------|------------------|------------------------------------------------------|
| **`--site`**                 | `string`  | `null`           | specify the site to deploy from the `.firebase.json` |
| **`--region`**               | `string`  |                  | region to deploy to                                  |
| **`--project`**              | `string`  |                  | GCP project to deploy to                             |
| **`--name`**                 | `string`  | `project.prefix` | name of the cloud run instance                       |
| **`--allowUnauthenticated`** | `boolean` | `true`           | allow unauthenticated requests                       |
| **`--concurrency`**          | `number`  | 250              | amount of concurrent requests for instance           |
| **`--maxInstances`**         | `number`  | 10               | maximum amount of instances                          |
| **`--minInstances`**         | `number`  | 0                | minimum amount of instances                          |
