# @nx-extend/vercel

<a href="https://www.npmjs.com/package/@nx-extend/vercel" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/vercel" alt="@nx-extend/vercel NPM package">
</a>

**Nx plugin to deploy your app to [Vercel](https://vercel.com)**.

## Features

- Build Vercel projects from Nx workspace
- Deploy to Vercel with full configuration
- Support for project and organization IDs
- Debug mode for troubleshooting

## Setup

### Install

```sh
npm install -D @nx-extend/vercel
```

## Usage

### Build

Build your application for Vercel:

```sh
nx build <project-name>
```

#### Available Options

| Name              | Type      | Default | Description               |
|-------------------|-----------|---------|---------------------------|
| **`projectId`**   | `string`  | -       | Project ID of Vercel      |
| **`orgId`**       | `string`  | -       | Organisation ID of Vercel |
| **`debug`**       | `boolean` | `false` | Run Vercel in debug mode  |

### Deploy

Deploy your application to Vercel:

```sh
nx deploy <project-name>
```

#### Available Options

| Name          | Type      | Default | Description              |
|---------------|-----------|---------|--------------------------|
| **`debug`**   | `boolean` | `false` | Run Vercel in debug mode |

## How to Create a Vercel Project Through the CLI

To create a new Vercel project, run the following commands:

```sh
# Make sure you are in the right org
npx vercel teams list

# If needed, switch to correct team
npx vercel teams switch <team-id>

# Create the project
npx vercel project add <my-project>

# Go to the Vercel dashboard, <my-project> > settings > Project ID
```

## Examples

### Build with Project Configuration

```json
{
  "build": {
    "executor": "@nx-extend/vercel:build",
    "options": {
      "projectId": "prj_abc123xyz",
      "orgId": "team_abc123xyz"
    }
  }
}
```

### Deploy with Debug Mode

```json
{
  "deploy": {
    "executor": "@nx-extend/vercel:deploy",
    "options": {
      "debug": true
    }
  }
}
```
