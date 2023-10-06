# @nx-extend/strapi

<a href="https://www.npmjs.com/package/@nx-extend/strapi" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/strapi" alt="@nx-extend/strapi NPM package">
</a>

**Nx plugin to generate and run your [Strapi](https://strapi.io/) project**.

## Setup

### Install

```sh
npm install -D @nx-extend/strapi
nx g @nx-extend/strapi:init
```

## Usage

### Build

#### Available options:

| name                     | type      | default      | description                                                               |
|--------------------------|-----------|--------------|---------------------------------------------------------------------------|
| **`--production`**       | `boolean` | `false`      | Build in production mode                                                  |
| **`--root`**             | `string`  | Project root | Root of the Strapi project to use                                         |
| **`--outputPath`**       | `string`  |              | Output path to output the build to                                        |
| **`--envVars`**          | `object`  |              | Define env variables to set before building (can be used in project.json) |
| **`--generateLockFile`** | `string`  | `false`      | Generate a lockfile                                                       |

### Serve

#### Available options:

| name               | type     | default      | description                                                                                                                                   |
|--------------------|----------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **`--build`**      | `string` | `true`       | Starts your application with the autoReload enabled and skip the administration panel build process                                           |
| **`--watchAdmin`** | `string` | `false`      | Starts your application with the autoReload enabled and the front-end development server. It allows you to customize the administration panel |
| **`--root`**       | `string` | Project root | Root of the Strapi project to use                                                                                                             |
| **`--envVars`**    | `object` |              | Define env variables to set before building (can be used in project.json)                                                                     |
