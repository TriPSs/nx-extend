# @nx-extend/strapi

<a href="https://www.npmjs.com/package/@nx-extend/strapi" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/strapi" alt="@nx-extend/strapi NPM package">
</a>

**Nx plugin to generate and run your [Strapi](https://strapi.io/) project**.

## Features

- Generate Strapi applications in your Nx workspace
- Build Strapi projects with custom output paths
- Development server with auto-reload
- Admin panel development mode
- Environment variable configuration
- Lock file generation support

## Setup

### Install

```sh
npm install -D @nx-extend/strapi
nx g @nx-extend/strapi:init
```

## Usage

### Build

Build your Strapi application:

```sh
nx build <project-name>
```

#### Available Options

| Name                     | Type      | Default        | Description                                                               |
|--------------------------|-----------|----------------|---------------------------------------------------------------------------|
| **`production`**         | `boolean` | `false`        | Build in production mode                                                  |
| **`root`**               | `string`  | Project root   | Root of the Strapi project to use                                         |
| **`outputPath`**         | `string`  | -              | Output path to output the build to                                        |
| **`envVars`**            | `object`  | -              | Define env variables to set before building (can be used in project.json) |
| **`generateLockFile`**   | `boolean` | `false`        | Generate a lockfile                                                       |

### Serve

Start the Strapi development server:

```sh
nx serve <project-name>
```

#### Available Options

| Name               | Type      | Default        | Description                                                                                                                                   |
|--------------------|-----------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **`build`**        | `boolean` | `true`         | Starts your application with the autoReload enabled and skip the administration panel build process                                           |
| **`watchAdmin`**   | `boolean` | `false`        | Starts your application with the autoReload enabled and the front-end development server. It allows you to customize the administration panel |
| **`root`**         | `string`  | Project root   | Root of the Strapi project to use                                                                                                             |
| **`envVars`**      | `object`  | -              | Define env variables to set before building (can be used in project.json)                                                                     |

## Examples

### Build for Production

```json
{
  "build": {
    "executor": "@nx-extend/strapi:build",
    "options": {
      "production": true,
      "outputPath": "dist/apps/my-strapi",
      "envVars": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Serve with Admin Panel Development

```json
{
  "serve": {
    "executor": "@nx-extend/strapi:serve",
    "options": {
      "watchAdmin": true,
      "envVars": {
        "NODE_ENV": "development"
      }
    }
  }
}
```
