# @nx-extend/vercel

<a href="https://www.npmjs.com/package/@nx-extend/vercel" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/vercel" alt="@nx-extend/vercel NPM package">
</a>

**Nx plugin for deploy your app to [Vercel](https://vercel.com)**.

## Setup

### Install

```sh
npm install -D @nx-extend/vercel
```

## Usage

### Build

#### Available options:

| name              | type      | default | description               |
|-------------------|-----------|---------|---------------------------|
| **`--projectId`** | `string`  | ``      | Project ID of Vercel      |
| **`--orgId`**     | `string`  | ``      | Organisation ID of Vercel |
| **`--debug`**     | `boolean` | `false` | Run Vercel in debug mode  |

### Deploy

#### Available options:

| name          | type      | default | description              |
|---------------|-----------|---------|--------------------------|
| **`--debug`** | `boolean` | `false` | Run Vercel in debug mode |

## How to create a Vercel project through the CLI

To create a new Vercel project run the following commands:

```bash
# Make sure you are in the right org
npx vercel teams list
# If needed, switch to correct team
npx vercel teams switch <team-id>
# Create the project
npx vercel project add <my-project>
# Go to the Vercel dashboard, <my-project> > settings > Project ID
```

