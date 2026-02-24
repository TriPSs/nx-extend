# @nx-extend/gcp-storage

<a href="https://www.npmjs.com/package/@nx-extend/gcp-storage" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-storage" alt="@nx-extend/gcp-storage NPM package">
</a>

**Nx plugin to deploy your app to [Cloud Storage](https://cloud.google.com/storage)**.

## Features

- Upload files to Google Cloud Storage buckets
- Optional gzip compression for uploaded files
- Configurable gzip extensions
- Ideal for static site hosting

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-storage
```

## Usage

### Upload

Upload files to a Cloud Storage bucket:

```sh
nx upload <project-name>
```

#### Available Options

| Name               | Type      | Default | Description                                 |
|--------------------|-----------|---------|---------------------------------------------|
| **`bucket`**       | `string`  | -       | What bucket to upload to                    |
| **`directory`**    | `string`  | -       | Directory to upload                         |
| **`gzip`**         | `boolean` | `false` | Use gzip when uploading                     |
| **`gzipExtensions`** | `string` | -       | File extensions to gzip (comma-separated)   |

## Examples

### Basic Upload

```json
{
  "upload": {
    "executor": "@nx-extend/gcp-storage:upload",
    "options": {
      "bucket": "my-static-site",
      "directory": "dist/apps/my-app"
    }
  }
}
```

### Upload with Gzip Compression

```json
{
  "upload": {
    "executor": "@nx-extend/gcp-storage:upload",
    "options": {
      "bucket": "my-static-site",
      "directory": "dist/apps/my-app",
      "gzip": true,
      "gzipExtensions": "html,css,js,json,svg"
    }
  }
}
```
