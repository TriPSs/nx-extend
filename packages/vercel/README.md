# @nx-extend/vercel

<a href="https://www.npmjs.com/package/@nx-extend/vercel" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/vercel" alt="@nx-extend/vercel NPM package">
</a>

**Nx plugin for deploy your app to [Vercel](https://vercel.com)**.

## Setup

### Install

```sh
npm install -D @nx-extend/vercel
```

## Usage

### Build

#### Available options:

| name              | type      | default | description               |
|-------------------|-----------|---------|---------------------------|
| **`--projectId`** | `string`  | ``      | Project ID of Vercel      |
| **`--orgId`**     | `string`  | ``      | Organisation ID of Vercel |
| **`--debug`**     | `boolean` | `false` | Run Vercel in debug mode  |

### Deploy

#### Available options:

| name          | type      | default | description              |
|---------------|-----------|---------|--------------------------|
| **`--debug`** | `boolean` | `false` | Run Vercel in debug mode |
