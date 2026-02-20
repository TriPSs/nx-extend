# @nx-extend/gcp-secrets

<a href="https://www.npmjs.com/package/@nx-extend/gcp-secrets" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-secrets" alt="@nx-extend/gcp-secrets NPM package">
</a>

**Nx plugin to deploy your secrets to [Secret Manager](https://cloud.google.com/secret-manager)**.

## Features

- Encrypt and decrypt secrets locally
- Deploy secrets to Google Cloud Secret Manager
- Label management for secrets
- Configurable update behavior (destroy, delete, or disable)
- Integration with Nx workspace

## Setup

### Prerequisites

- `GCP_SECRETS_ENCRYPTION_KEY` environment variable set with your encryption key

### Install

```sh
npm install -D @nx-extend/gcp-secrets
nx g @nx-extend/gcp-secrets:init
```

## Usage

Add an environment variable named `GCP_SECRETS_ENCRYPTION_KEY` that holds your key to encrypt and decrypt your secrets:

```sh
export GCP_SECRETS_ENCRYPTION_KEY="your-encryption-key"
```

### Decrypt

Decrypt secrets locally:

```sh
nx decrypt <project-name>
```

#### Available Options

| Name           | Type     | Default | Description                            |
|----------------|----------|---------|----------------------------------------|
| **`secret`**   | `string` | -       | Only decrypt the secret with this name |

### Deploy

Deploy secrets to Google Cloud Secret Manager:

```sh
nx deploy <project-name>
```

#### Available Options

| Name            | Type     | Default | Description                            |
|-----------------|----------|---------|----------------------------------------|
| **`project`**   | `string` | -       | GCP project to deploy to               |
| **`secret`**    | `string` | -       | Only deploy the secret with this name  |

### Encrypt

Encrypt secrets locally:

```sh
nx encrypt <project-name>
```

#### Available Options

| Name           | Type     | Default | Description                            |
|----------------|----------|---------|----------------------------------------|
| **`secret`**   | `string` | -       | Only encrypt the secret with this name |

## Meta Data Explained

When configuring secrets, you can use the following metadata attributes:

| Attribute        | Default   | Description                                                 |
|------------------|-----------|-------------------------------------------------------------|
| **`status`**     | -         | Status of the file: `encrypted` or `decrypted`              |
| **`labels`**     | `[]`      | Array of labels to add to the secrets                       |
| **`onUpdateBehavior`** | `destroy` | What to do when updating: `destroy`, `delete`, or `disable` |
