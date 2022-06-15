# @nx-extend/gcp-task-runner

<a href="https://www.npmjs.com/package/@nx-extend/gcp-storage" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-storage" alt="@nx-extend/gcp-storage NPM package">
</a>

**Nx plugin to use [Cloud Storage](https://cloud.google.com/storage) as remote cache**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-task-runner
```

## Usage

### Enable task runner
Update your `nx.json` with the following

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nx-extend/gcp-task-runner",
      "options": {
        "bucket": "gs://your-bucket",
        ...
      }
    }
  }
}
```


### Authenticate

The task runner uses `@google-cloud/storage` which in turn is capable of using the env variable `GOOGLE_APPLICATION_CREDENTIALS`.
