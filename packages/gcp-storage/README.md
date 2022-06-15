# @nx-extend/gcp-storage

<a href="https://www.npmjs.com/package/@nx-extend/gcp-storage" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-storage" alt="@nx-extend/gcp-storage NPM package">
</a>

**Nx plugin for deploy your app to [Cloud Storage](https://cloud.google.com/storage)**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-storage
```

## Usage

### Upload

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| bucket | string |  | What bucket to upload to |
| directory | string | `/` | What directory of the apps dist folder to upload |
| gzip | boolean | false | Use gzip when uploading |
| gzipExtensions | string |  | For what extensions to use gzip |

