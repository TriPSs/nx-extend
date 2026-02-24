# @nx-extend/pulumi

<a href="https://www.npmjs.com/package/@nx-extend/pulumi" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/pulumi" alt="@nx-extend/pulumi NPM package">
</a>

**Nx plugin for deploying your resources with [Pulumi](https://www.pulumi.com/)**.

## Features

- Manage infrastructure as code with Pulumi
- Multiple executors for different Pulumi operations
- Stack management and configuration
- Preview changes before applying
- Import existing resources
- Refresh state

## Setup

### Prerequisites

- Pulumi CLI installed and available in PATH
- Pulumi account and project configured

### Install

```sh
npm install -D @nx-extend/pulumi
nx g @nx-extend/pulumi:init
```

## Usage

### Available Executors

#### Up

Deploy your Pulumi stack:

```sh
nx run <project-name>:up
```

##### Available options:

| Name       | Type     | Default | Description                                           |
|------------|----------|---------|-------------------------------------------------------|
| **`stack`** | `string` | -       | The target stack to use, if specified                 |
| **`root`**  | `string` | -       | The working directory to run Pulumi commands from     |

#### Preview

Preview changes to your stack:

```sh
nx run <project-name>:preview
```

##### Available options:

| Name       | Type     | Default | Description                                           |
|------------|----------|---------|-------------------------------------------------------|
| **`stack`** | `string` | -       | The target stack to use, if specified                 |
| **`root`**  | `string` | -       | The working directory to run Pulumi commands from     |

#### Refresh

Refresh the state of your stack:

```sh
nx run <project-name>:refresh
```

##### Available options:

| Name       | Type     | Default | Description                                           |
|------------|----------|---------|-------------------------------------------------------|
| **`stack`** | `string` | -       | The target stack to use, if specified                 |
| **`root`**  | `string` | -       | The working directory to run Pulumi commands from     |

#### Import

Import existing resources into your Pulumi stack:

```sh
nx run <project-name>:import
```

##### Available options:

| Name       | Type     | Default | Description                                           |
|------------|----------|---------|-------------------------------------------------------|
| **`stack`** | `string` | -       | The target stack to use, if specified                 |
| **`root`**  | `string` | -       | The working directory to run Pulumi commands from     |

### Config

Set config variable:

```sh
nx config <project-name> set --name="<name>" --value="<value>"
```

Set secret config variable:

```sh
nx config <project-name> set --secret --name="<name>" --value="<value>"
```

##### Available options:

| Name         | Type      | Default | Description                                         |
|--------------|-----------|---------|-----------------------------------------------------|
| **`stack`**  | `string`  | -       | The target stack to use, if specified               |
| **`root`**   | `string`  | -       | The working directory to run Pulumi commands from   |
| **`name`**   | `string`  | -       | The name of the config key to set                   |
| **`value`**  | `string`  | -       | The value to set                                    |
| **`secret`** | `boolean` | `false` | Whether to store the value as a secret              |

## Examples

### Basic Stack Deployment

```sh
nx run my-infrastructure:up --stack=production
```

### Preview Changes

```sh
nx run my-infrastructure:preview --stack=staging
```

### Set Configuration

```sh
nx config my-infrastructure set --name="region" --value="us-east-1"
nx config my-infrastructure set --secret --name="api-key" --value="secret-value"
```
