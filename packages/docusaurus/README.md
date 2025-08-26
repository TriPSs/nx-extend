# @nx-extend/docusaurus

<a href="https://www.npmjs.com/package/@nx-extend/docusaurus" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/docusaurus" alt="@nx-extend/docusaurus NPM package">
</a>

**Nx plugin for working with [docusaurus](https://docusaurus.io/)**.

## This was originally build by [nx-plus](https://github.com/ZachJW34/nx-plus)

## Contents

- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
- [Schematics (i.e. code generation)](#schematics-ie-code-generation)
- [Builders (i.e. task runners)](#builders-ie-task-runners)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Install Plugin

```
# npm
npm install @nx-extend/docusaurus --save-dev

# yarn
yarn add @nx-extend/docusaurus --dev
```

### Generate Your App

```
nx g @nx-extend/docusaurus:app my-app
```

### Serve Your App

```
nx serve my-app
```

## Schematics (i.e. code generation)

### Application

`nx g @nx-extend/docusaurus:app <name> [options]`

| Arguments | Description           |
| --------- | --------------------- |
| `<name>`  | The name of your app. |

| Options        | Default | Description                                |
| -------------- | ------- | ------------------------------------------ |
| `--tags`       | -       | Tags to use for linting (comma-delimited). |
| `--directory`  | `apps`  | A directory where the project is placed.   |
| `--skipFormat` | `false` | Skip formatting files.                     |

## Builders (i.e. task runners)

### Dev Server

`nx serve <name> [options]`

| Arguments | Description           |
| --------- | --------------------- |
| `<name>`  | The name of your app. |

| Options     | Default     | Description                                          |
| ----------- | ----------- | ---------------------------------------------------- |
| `--port`    | `3000`      | Use specified port.                                  |
| `--host`    | `localhost` | Use specified host.                                  |
| `--hotOnly` | `false`     | Do not fallback to page refresh if hot reload fails. |
| `--open`    | `false`     | Open page in the browser.                            |

### Browser

`nx build <name> [options]`

| Arguments | Description           |
| --------- | --------------------- |
| `<name>`  | The name of your app. |

| Options            | Default | Description                                                                    |
| ------------------ | ------- | ------------------------------------------------------------------------------ |
| `--bundleAnalyzer` | `false` | Visualize size of webpack output files with an interactive zoomable treemap.   |
| `--outputPath`     | -       | The full path for the new output directory, relative to the current workspace. |
| `--minify`         | `true`  | Build website minimizing JS bundles.                                           |

## Troubleshooting

If you encounter this error while building a Docusaurus app, then you may need to add a `terser` resolution to your `package.json`. Note: this only works with Yarn and not npm.

**Error:**

```
Docusaurus user: you probably have this known error due to using a monorepo/workspace.
We have a workaround for you, check https://github.com/facebook/docusaurus/issues/3515
```

**package.json:**

```
{
  // ...
  "resolutions": {
    "terser": "^4.0.0"
  }
  // ...
}
```

Once this has been updated, you should be able to run `yarn install` and then build your Docusaurus application.
