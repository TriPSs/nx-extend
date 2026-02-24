# @nx-extend/gcp-task-runner

<a href="https://www.npmjs.com/package/@nx-extend/gcp-task-runner" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-task-runner" alt="@nx-extend/gcp-task-runner NPM package">
</a>

**Nx plugin to use [Cloud Storage](https://cloud.google.com/storage) as remote cache**.

## Features

- Use Google Cloud Storage as Nx remote cache
- Automatic authentication via Google Cloud credentials
- Compatible with Nx's caching infrastructure
- Drop-in replacement for default Nx cache

## Setup

### Prerequisites

- Google Cloud project with Cloud Storage enabled
- Google Cloud credentials configured

### Install

```sh
npm install -D @nx/gcs-cache@npm:@nx-extend/gcp-task-runner@<latest version>
```

## Usage

### Enable task runner

Update your `nx.json` with the following:

```json
{
  "gcs": {
    "bucket": "your-bucket"
  }
}
```

### Authenticate

The task runner uses `@google-cloud/storage` which in turn is capable of using the env variable `GOOGLE_APPLICATION_CREDENTIALS`.

Set this environment variable to point to your service account key file:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

## Available Options

| Name         | Type     | Default | Description                                    |
|--------------|----------|---------|------------------------------------------------|
| **`bucket`** | `string` | -       | Name of the Google Cloud Storage bucket to use |
