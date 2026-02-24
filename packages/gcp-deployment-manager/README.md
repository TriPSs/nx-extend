# @nx-extend/gcp-deployment-manager

<a href="https://www.npmjs.com/package/@nx-extend/gcp-deployment-manager" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-deployment-manager" alt="@nx-extend/gcp-deployment-manager NPM package">
</a>

**Nx plugin for deploying your Google resources with [Deployment Manager](https://cloud.google.com/deployment-manager/docs)**.

## Features

- Deploy Google Cloud resources using configuration files
- Infrastructure as code with YAML or Python templates
- Manage resource lifecycle
- Integration with Nx workspace

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-deployment-manager
nx g @nx-extend/gcp-deployment-manager:init
```

## Usage

### Deploy

Deploy your resources to Google Cloud:

```sh
nx deploy <project-name>
```

#### Available Options

| Name            | Type     | Default | Description                              |
|-----------------|----------|---------|------------------------------------------|
| **`project`**   | `string` | -       | GCP project to deploy to                 |
| **`file`**      | `string` | -       | File from source to create               |
| **`name`**      | `string` | -       | Name of the resource inside Google Cloud |
