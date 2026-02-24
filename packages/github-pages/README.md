# @nx-extend/github-pages

<a href="https://www.npmjs.com/package/@nx-extend/github-pages" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/github-pages" alt="@nx-extend/github-pages NPM package">
</a>

**Nx plugin to deploy your app to [GitHub Pages](https://pages.github.com/)**.

## Features

- Deploy static sites to GitHub Pages
- Automatic deployment from build output
- Configurable target branch
- Integration with GitHub Actions

## Setup

### Prerequisites

- GitHub repository with Pages enabled
- `GH_PAGES_ACCESS_TOKEN` environment variable set with a GitHub Personal Access Token
- A build target configured in your project

### Install

```sh
npm install -D @nx-extend/github-pages
```

## Usage

### Configure Deploy Target

Add the deploy target to your `project.json`:

```json
{
  "targets": {
    "build": {
      "executor": "@nx/web:webpack",
      "options": {
        "outputPath": "dist/apps/my-app"
      }
    },
    "deploy": {
      "executor": "@nx-extend/github-pages:deploy",
      "options": {
        "branch": "gh-pages"
      }
    }
  }
}
```

### Deploy

```sh
nx deploy my-app
```

### Environment Variables

Set the following environment variable before deploying:

```sh
export GH_PAGES_ACCESS_TOKEN="your-github-token"
```

## Available Options

| Name         | Type     | Default      | Description                                          |
|--------------|----------|--------------|------------------------------------------------------|
| **`branch`** | `string` | `"gh-pages"` | The branch to deploy to (typically `gh-pages`)       |

## Notes

- The executor automatically reads the `outputPath` from your build target configuration
- Make sure your build target runs before deploying
- The GitHub token needs repository write permissions
