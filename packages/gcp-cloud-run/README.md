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

| name                             | type                 | default          | description                                                             |
|----------------------------------|----------------------|------------------|-------------------------------------------------------------------------|
| **`--region`**                   | `string`             | -                | Region to deploy cloud run revision to.
| **`--project`**                  | `string`             | -                | GCP project to deploy cloud run revision to.
| **`--name`**                     | `string`             | `project name` | Name of the cloud run revision.
| **`--concurrency`**              | `number`             | 250              | Maximum number of concurrent requests allowed per container instance.
| **`--maxInstances`**             | `number`             | 10               | Maximum number of container instances to run.
| **`--minInstances`**             | `number`             | 0                | Minimum number of container instances to run.
| **`--allowUnauthenticated`**     | `boolean`            | `true`           | Whether to allow unauthenticated requests to cloud run service.
| **`--envVars`**                  | `{[k: string]: string}`   | -                | Environment variables to load into cloud run instance's environment.
| **`--secrets`**                  | `string[]`           | -                | Secrets to load into cloud run instance's environment.
| **`--memory`**                   | `string`             | `128Mi`          | Amount of memory to reserve for cloud run instance.
| **`--cloudSqlInstance`**         | `string`             | -                | Name of the cloud SQL instance to connect to run instance.
| **`--http2`**                    | `boolean`            | `false`          | Whether or not to enforce run instance to use HTTP/2 for all end-to-end connections.
| **`--serviceAccount`**           | `string`             | -                | Service account email of another identity if not using compute engine's default service account.
| **`--buildWith`**                | `string`             | `artifact-registry`  | Only accepts value `artifact-registry`. ***If provided***, deploy is ran with the `--source` options set to current app's directory. ***If not provided***, submits a build to Cloud Build, sourcing app's dist directory. Deploy is then ran using `--image`, which is given the location of the previous Cloud Build's built image.
| **`--logsDir`**                  | `string`             | -                | ***Note***: only relevant if not specifying `--buildWith`. Directory in GCS where to hold Cloud Build's build logs.
| **`--tagWithVersion`**           | `string`             | -                | Whether or not to tag run service with a version. (**note**: sources version from package.json)
| **`--noTraffic`**                | `boolean`            | `false`          | Set to true to ensure cloud run avoids sending traffic to the revision being deployed.
| **`--revisionSuffix`**           | `boolean`            | `false`          | Set to append to deployed revision's name.
| **`--timeout`**                  | `number`             | -                | set the maximum request execution time.
| **`--cpu`**                      | `number`             | -                | set a CPU limit in Kubernetes cpu units.
| **`--cpuBoost`**                 | `boolean`            | -                | Whether to allocate extra CPU to containers on startup to reduce the perceived latency of a cold start request.
| **`--ingress`**                  | `string`             | -                | Set the ingress traffic sources allowed to call the service.
