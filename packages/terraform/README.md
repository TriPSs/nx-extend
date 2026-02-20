# @nx-extend/terraform

<a href="https://www.npmjs.com/package/@nx-extend/terraform" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/terraform" alt="@nx-extend/terraform NPM package">
</a>

**Nx plugin for deploying your resources with [Terraform](https://www.terraform.io/)**.

## Features

- Manage infrastructure as code with Terraform
- Full lifecycle management (init, plan, apply, destroy)
- Workspace management for multiple environments
- Variable and secret management
- Backend configuration support
- State migration and reconfiguration
- Format validation and testing
- Provider lock file management
- CI mode for automated deployments

## Setup

### Prerequisites

- Terraform CLI installed and available in PATH

### Install

```sh
npm install -D @nx-extend/terraform
nx g @nx-extend/terraform:init
```

#### Available Options

| Name              | Type      | Required | Default | Description                                                      |
|-------------------|-----------|----------|---------|------------------------------------------------------------------|
| **`name`**        | `string`  | `true`   | -       | Terraform project name                                           |
| **`directory`**   | `string`  | `false`  | -       | A directory where the project is placed, based on the sourceRoot |
| **`tags`**        | `string`  | `false`  | -       | Comma separated list for tags                                    |

## Usage

### Initialize

Initialize Terraform working directory:

```sh
nx run <terraform-project-name>:initialize
```

### Plan

Generate and show an execution plan:

```sh
nx run <terraform-project-name>:plan
```

### Apply

Apply the changes required to reach the desired state:

```sh
nx run <terraform-project-name>:apply
```

### Destroy

Destroy Terraform-managed infrastructure:

```sh
nx run <terraform-project-name>:destroy
```

### Validate

Validate Terraform configuration files:

```sh
nx run <terraform-project-name>:validate
```

### Test

Run Terraform tests:

```sh
nx run <terraform-project-name>:test
```

### Workspace

Manage Terraform workspaces:

```sh
nx run <terraform-project-name>:workspace
```

### Providers

Manage provider versions and lock files:

```sh
nx run <terraform-project-name>:providers
```

### Format

Format Terraform configuration files:

```sh
nx run <terraform-project-name>:fmt
```

## Available Options

| Name                  | Type      | Default  | Description                                                                                    | Supported Commands                 |
|:----------------------|:----------|:---------|:-----------------------------------------------------------------------------------------------|:-----------------------------------|
| **`ciMode`**          | `boolean` | `false`  | Enables CI mode (sets `TF_IN_AUTOMATION=true` and `TF_INPUT=0`)                               | All                                |
| **`varFile`**         | `string`  | -        | Path to a variable file (passed as `--var-file`)                                               | `plan`, `apply`, `test`            |
| **`varString`**       | `string`  | -        | Inline variables (passed as `--var`)                                                           | `plan`, `apply`, `test`            |
| **`planFile`**        | `string`  | -        | Path to output the plan file (e.g., `tfplan`)                                                  | `plan`, `apply`                    |
| **`autoApproval`**    | `boolean` | `false`  | Skips interactive approval (passed as `-auto-approve`)                                         | `apply`, `destroy`                 |
| **`workspace`**       | `string`  | -        | Name of the workspace. **Required** for `new`, `select`, and `delete` actions                 | `workspace`                        |
| **`workspaceAction`** | `string`  | `select` | Action to perform on the workspace. Accepted values: `select`, `new`, `delete`, `list`        | `workspace`                        |
| **`backendConfig`**   | `array`   | `[]`     | Backend configuration (e.g., `[{ "key": "bucket", "name": "my-bucket" }]`)                    | `init`                             |
| **`reconfigure`**     | `boolean` | `false`  | Reconfigure the backend (passed as `-reconfigure`)                                             | `init`                             |
| **`migrateState`**    | `boolean` | `false`  | Migrate state during init (passed as `-migrate-state`)                                         | `init`                             |
| **`upgrade`**         | `boolean` | `false`  | Install the latest module and provider versions (passed as `-upgrade`)                         | `init`                             |
| **`formatWrite`**     | `boolean` | `false`  | If `true`, updates files in place. If `false`, only checks formatting                          | `fmt`                              |
| **`lock`**            | `boolean` | `false`  | Update the lock file (passed as `lock`)                                                        | `providers`                        |

## Usage Examples

### Using Variables Files

```sh
# Plan with a specific tfvars file
nx run my-project:plan --varFile=config/dev.tfvars

# Apply with inline variables
nx run my-project:apply --varString="region=us-east-1"
```

### Managing Workspaces

```sh
# List all workspaces
nx run my-project:workspace --workspaceAction=list

# Create a new workspace named 'staging'
nx run my-project:workspace --workspaceAction=new --workspace=staging

# Select 'staging' workspace (default action is select)
nx run my-project:workspace --workspace=staging

# Delete 'staging' workspace
nx run my-project:workspace --workspaceAction=delete --workspace=staging
```

### CI/CD Integration

```sh
# Run in CI mode with auto-approval
nx run my-project:apply --ciMode --autoApproval
```

### Backend Configuration

```json
{
  "initialize": {
    "executor": "@nx-extend/terraform:init",
    "options": {
      "backendConfig": [
        { "key": "bucket", "value": "my-terraform-state" },
        { "key": "prefix", "value": "terraform/state" }
      ]
    }
  }
}
```
