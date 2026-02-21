# @nx-extend/gcp-cloud-run

<a href="https://www.npmjs.com/package/@nx-extend/gcp-cloud-run" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-cloud-run" alt="@nx-extend/gcp-cloud-run NPM package">
</a>

**Nx plugin to deploy your app to [Cloud Run](https://cloud.google.com/run)**.

## Features

- Deploy containerized applications to Google Cloud Run
- Automatic container builds via Cloud Build or Artifact Registry
- Configurable scaling and resource limits
- Environment variable and secret management
- Cloud SQL instance connectivity
- Version tagging and traffic management

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-cloud-run
```

## Usage

### Deploy

Deploy your application to Cloud Run:

```sh
nx deploy <project-name>
```

#### Available Options

| Name                         | Type                    | Default             | Description                                                             |
|------------------------------|-------------------------|---------------------|-------------------------------------------------------------------------|
| **`region`**                 | `string`                | -                   | Region to deploy Cloud Run revision to                                  |
| **`project`**                | `string`                | -                   | GCP project to deploy Cloud Run revision to                             |
| **`name`**                   | `string`                | `project name`      | Name of the Cloud Run revision                                          |
| **`concurrency`**            | `number`                | `250`               | Maximum number of concurrent requests allowed per container instance    |
| **`maxInstances`**           | `number`                | `10`                | Maximum number of container instances to run                            |
| **`minInstances`**           | `number`                | `0`                 | Minimum number of container instances to run                            |
| **`allowUnauthenticated`**   | `boolean`               | `true`              | Whether to allow unauthenticated requests to Cloud Run service          |
| **`envVars`**                | `{[k: string]: string}` | -                   | Environment variables to load into Cloud Run instance's environment     |
| **`secrets`**                | `string[]`              | -                   | Secrets to load into Cloud Run instance's environment                   |
| **`memory`**                 | `string`                | `128Mi`             | Amount of memory to reserve for Cloud Run instance                      |
| **`cloudSqlInstance`**       | `string`                | -                   | Name of the Cloud SQL instance to connect to Run instance               |
| **`http2`**                  | `boolean`               | `false`             | Whether to enforce Run instance to use HTTP/2 for end-to-end connections|
| **`serviceAccount`**         | `string`                | -                   | Service account email of another identity (if not using default)        |
| **`buildWith`**              | `string`                | `artifact-registry` | Only accepts `artifact-registry`. If provided, deploy runs with `--source` set to app's directory. If not provided, submits build to Cloud Build sourcing app's dist directory, then deploys using `--image` with the built image location |
| **`logsDir`**                | `string`                | -                   | Note: only relevant if not specifying `--buildWith`. Directory in GCS where to hold Cloud Build's build logs |
| **`tagWithVersion`**         | `string`                | -                   | Whether to tag Run service with a version (sources version from package.json) |
| **`noTraffic`**              | `boolean`               | `false`             | Set to true to ensure Cloud Run avoids sending traffic to the revision being deployed |
| **`revisionSuffix`**         | `boolean`               | `false`             | Set to append to deployed revision's name                               |
| **`timeout`**                | `number`                | -                   | Set the maximum request execution time                                  |
| **`cpu`**                    | `number`                | -                   | Set a CPU limit in Kubernetes CPU units                                 |
| **`cpuBoost`**               | `boolean`               | -                   | Whether to allocate extra CPU to containers on startup to reduce cold start latency |
| **`ingress`**                | `string`                | -                   | Set the ingress traffic sources allowed to call the service             |

## Examples

### Basic Deployment

```json
{
  "deploy": {
    "executor": "@nx-extend/gcp-cloud-run:deploy",
    "options": {
      "region": "us-central1",
      "project": "my-gcp-project",
      "name": "my-app",
      "memory": "512Mi",
      "maxInstances": 5
    }
  }
}
```

### Deployment with Environment Variables and Secrets

```json
{
  "deploy": {
    "executor": "@nx-extend/gcp-cloud-run:deploy",
    "options": {
      "region": "us-central1",
      "project": "my-gcp-project",
      "envVars": {
        "NODE_ENV": "production",
        "API_URL": "https://api.example.com"
      },
      "secrets": [
        "DATABASE_PASSWORD:latest",
        "API_KEY:latest"
      ]
    }
  }
}
```
