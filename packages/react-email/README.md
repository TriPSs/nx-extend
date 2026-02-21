# @nx-extend/react-email

<a href="https://www.npmjs.com/package/@nx-extend/react-email" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/react-email" alt="@nx-extend/react-email NPM package">
</a>

**Nx plugin for building emails with [React Email](https://react.email)**.

## Features

- Build and preview emails using React components
- Live development server for email templates
- Export emails to static HTML
- Full TypeScript support
- Integration with Nx workspace

## Setup

### Install

```sh
npm install -D @nx-extend/react-email
nx g @nx-extend/react-email:init
```

## Usage

### Serve

Start the React Email development server to preview your email templates:

```sh
nx serve <project-name>
```

#### Available options:

| Name       | Type     | Default | Description                           |
|------------|----------|---------|---------------------------------------|
| **`port`** | `string` | -       | Port to run the development server on |

### Export

Export your email templates to static HTML files:

```sh
nx export <project-name>
```

#### Available options:

| Name              | Type     | Default | Description                        |
|-------------------|----------|---------|------------------------------------|
| **`outputPath`**  | `string` | -       | Output path to output the build to |

## Examples

### Start Development Server

```sh
nx serve my-emails --port=3000
```

### Export Email Templates

```sh
nx export my-emails --outputPath=dist/emails
```

## Project Structure

After initialization, your project will typically have the following structure:

```
my-emails/
├── src/
│   └── emails/
│       └── welcome.tsx
└── project.json
```

Create email components in the `src/emails` directory using React Email components.
