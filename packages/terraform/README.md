# @nx-extend/terraform

<a href="https://www.npmjs.com/package/@nx-extend/terraform" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/terraform" alt="@nx-extend/terraform NPM package">
</a>

**Nx plugin for deploying your resources with [terraform](https://www.terraform.io/)**.

## Setup

This package expects Terraform to be already installed and available.

### Install

```sh
npm install -D @nx-extend/terraform
nx g @nx-extend/terraform:init
```

## Usage

### Setup
```sh
nx g @nx-extend/terraform:init
```

#### Available options:

| name              | type     | required | default | description                                                      |
|-------------------|----------|----------|---------|------------------------------------------------------------------|
| **`--name`**      | `string` | `true`   |         | Terraform project name                                           |
| **`--directory`** | `string` | `false`  |         | A directory where the project is placed, based on the sourceRoot |
| **`--tags`**      | `string` | `false`  | `empty` | Comma separated list for tags                                    |

### Terraform execution

```sh
nx run <terraform-project-name>:initialize
nx run <terraform-project-name>:providers
nx run <terraform-project-name>:plan
nx run <terraform-project-name>:apply
nx run <terraform-project-name>:destroy
nx run <terraform-project-name>:validate
nx run <terraform-project-name>:test
```

#### Available options:

| name | type | default | description |
|------|------|---------|-------------|
