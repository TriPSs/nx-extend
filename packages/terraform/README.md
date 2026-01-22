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
nx run <terraform-project-name>:workspace
```

#### Available options:

| Name | Type | Default | Description | Supported Commands |
| :--- | :--- | :--- | :--- | :--- |
| `ciMode` | `boolean` | `false` | Enables CI mode (sets `TF_IN_AUTOMATION=true` and `TF_INPUT=0`). | All |
| `varFile` | `string` | - | Path to a variable file (passed as `--var-file`). | `plan`, `apply`, `test` |
| `varString` | `string` | - | Inline variables (passed as `--var`). | `plan`, `apply`, `test` |
| `planFile` | `string` | - | Path to output the plan file (e.g., `tfplan`). | `plan`, `apply` |
| `autoApproval` | `boolean` | `false` | Skips interactive approval (passed as `-auto-approve`). | `apply`, `destroy` |
| `workspace` | `string` | - | Name of the workspace. **Required** for `new`, `select`, and `delete` actions. | `workspace` |
| `workspaceAction` | `string` | `select` | Action to perform on the workspace. Accepted values: `select`, `new`, `delete`, `list`. | `workspace` |
| `backendConfig` | `array` | `[]` | Backend configuration (e.g., `[{ "key": "bucket", "name": "my-bucket" }]`). | `init` |
| `reconfigure` | `boolean` | `false` | Reconfigure the backend (passed as `-reconfigure`). | `init` |
| `migrateState` | `boolean` | `false` | Migrate state during init (passed as `-migrate-state`). | `init` |
| `upgrade` | `boolean` | `false` | Install the latest module and provider versions (passed as `-upgrade`). | `init` |
| `formatWrite` | `boolean` | `false` | If `true`, updates files in place. If `false`, only checks formatting. | `fmt` |
| `lock` | `boolean` | `false` | Update the lock file (passed as `lock`). | `providers` |


#### Usage examples

##### Using variables files

```bash
# Plan with a specific tfvars file
nx run my-project:plan --varFile=config/dev.tfvars

# Apply with inline variables
nx run my-project:apply --varString="region=us-east-1"
```

#### Managing workspaces
```bash
# List all workspaces
nx run my-project:workspace --workspaceAction=list

# Create a new workspace named 'staging'
nx run my-project:workspace --workspaceAction=new --workspace=staging

# Select 'staging' workspace (default action is select)
nx run my-project:workspace --workspace=staging

# Delete 'staging' workspace
nx run my-project:workspace --workspaceAction=delete --workspace=staging
```