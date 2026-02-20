# @nx-extend/docusaurus

<a href="https://www.npmjs.com/package/@nx-extend/docusaurus" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/docusaurus" alt="@nx-extend/docusaurus NPM package">
</a>

**Nx plugin for working with [Docusaurus](https://docusaurus.io/)**.

## Features

- Generate Docusaurus applications in your Nx workspace
- Development server with hot reload
- Production builds with optimization
- Bundle analyzer support
- Full Nx integration with caching and dependencies

## Attribution

This was originally built by [nx-plus](https://github.com/ZachJW34/nx-plus).

## Setup

### Install

```sh
npm install -D @nx-extend/docusaurus
```

## Usage

### Generate Application

Generate a new Docusaurus application:

```sh
nx g @nx-extend/docusaurus:app my-app
```

#### Available Options

| Name            | Type      | Default | Description                                |
|-----------------|-----------|---------|---------------------------------------------|
| **`name`**      | `string`  | -       | The name of your app                        |
| **`tags`**      | `string`  | -       | Tags to use for linting (comma-delimited)   |
| **`directory`** | `string`  | `apps`  | A directory where the project is placed     |
| **`skipFormat`** | `boolean` | `false` | Skip formatting files                       |

### Serve

Start the development server:

```sh
nx serve my-app
```

#### Available Options

| Name          | Type      | Default      | Description                                          |
|---------------|-----------|--------------|------------------------------------------------------|
| **`port`**    | `number`  | `3000`       | Use specified port                                   |
| **`host`**    | `string`  | `localhost`  | Use specified host                                   |
| **`hotOnly`** | `boolean` | `false`      | Do not fallback to page refresh if hot reload fails  |
| **`open`**    | `boolean` | `false`      | Open page in the browser                             |

### Build

Build your application for production:

```sh
nx build my-app
```

#### Available Options

| Name                | Type      | Default | Description                                                                    |
|---------------------|-----------|---------|--------------------------------------------------------------------------------|
| **`bundleAnalyzer`** | `boolean` | `false` | Visualize size of webpack output files with an interactive zoomable treemap    |
| **`outputPath`**    | `string`  | -       | The full path for the new output directory, relative to the current workspace  |
| **`minify`**        | `boolean` | `true`  | Build website minimizing JS bundles                                            |

## Troubleshooting

If you encounter this error while building a Docusaurus app, then you may need to add a `terser` resolution to your `package.json`. Note: this only works with Yarn and not npm.

**Error:**

```
Docusaurus user: you probably have this known error due to using a monorepo/workspace.
We have a workaround for you, check https://github.com/facebook/docusaurus/issues/3515
```

**Solution (package.json):**

```json
{
  "resolutions": {
    "terser": "^4.0.0"
  }
}
```

Once this has been updated, run `yarn install` and then build your Docusaurus application.
