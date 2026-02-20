# @nx-extend/firebase-hosting

<a href="https://www.npmjs.com/package/@nx-extend/firebase-hosting" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/firebase-hosting" alt="@nx-extend/firebase-hosting NPM package">
</a>

**Nx plugin to deploy your app to [Firebase Hosting](https://firebase.google.com/products/hosting)**.

## Features

- Deploy static sites to Firebase Hosting
- Automatic integration with Firebase configuration
- Multi-site hosting support
- Seamless integration with Nx build targets

## Setup

### Install

```sh
npm install -D @nx-extend/firebase-hosting
nx g @nx-extend/firebase-hosting:add
```

This will add the following to the target:

```json
{
  "deploy": {
    "executor": "@nx-extend/firebase-hosting:deploy",
    "options": {
      "site": "<site provided in setup>"
    }
  }
}
```

And create a `.firebase.json` file if it does not exist already. If it exists, it will add this target to the hosting section:

```json
{
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

Deploy your application to Firebase Hosting:

```sh
nx deploy <project-name>
```

#### Available Options

| Name               | Type     | Default | Description                                                                                  |
|--------------------|----------|---------|----------------------------------------------------------------------------------------------|
| **`site`**         | `string` | -       | Specify the site to deploy from the `.firebase.json`                                         |
| **`project`**      | `string` | -       | Firebase Project to deploy to                                                                |
| **`identifier`**   | `string` | -       | Name of the hosting project in Firebase (if not defined `--site` is used by the Firebase CLI) |
