# @nx-extend/firebase-hosting

<a href="https://www.npmjs.com/package/@nx-extend/firebase-hosting" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/firebase-hosting" alt="@nx-extend/firebase-hosting NPM package">
</a>

**Nx plugin for deploy your app to [Firebase Hosting](https://firebase.google.com/products/hosting)**.

## Setup

### Install

```sh
npm install -D @nx-extend/firebase-hosting
nx g @nx-extend/firebase-hosting:add
```

This will add the following to the target:

```json
{
  ...other targets
  "deploy": {
    "executor": "@nx-extend/firebase-hosting:deploy",
    "options": {
      "site": "<site provided in setup>"
    }
  }
}
```

And create a `.firebase.json` file if it does not exist already, if it exists it will
add this target to the hosting section:

```json
{
  ...other firebase config
  "hosting": [
    {
      "target": "<provided site name>",
      "public": "<target dist directory>",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ]
    }
  ]
}
```

## Usage

### Deploy

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| **`--site`** | `string` | `null`  | specify the site to deploy from the `.firebase.json` |
| **`--project`** | `string` | | Firebase Project to deploy to |

