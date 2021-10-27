# @nx-extend/gcp-secrets

<a href="https://www.npmjs.com/package/@nx-extend/gcp-secrets" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/gcp-secrets" alt="@nx-extend/gcp-secrets NPM package">
</a>

**Nx plugin for deploy your secrets [Secret Manager](https://cloud.google.com/secret-manager)**.

## Setup

### Install

```sh
npm install -D @nx-extend/gcp-secrets
nx g @nx-extend/gcp-secrets:init
```

## Usage

Add an environment variable named `GCP_SECRETS_ENCRYPTION_KEY` that holds your key to encrypt and decrypt your secrets.

### Decrypt

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |

### Deploy

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| **`--project`** | `string` | | GCP project to deploy to|

### Encrypt

#### Available options:

| name         | type     | default | description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |

## Meta data explained

| Attribute         | default     |  description                                          |
| ------------ | -------- | ------- |
| status |  | Status of the file, `encrypted` or `decrypted` |
| labels | `[]` | Array of labels to add to the secrets |
| onUpdateBehavior | `destroy` | What to do when updating, `destory`, `delete`, or `disable` |

