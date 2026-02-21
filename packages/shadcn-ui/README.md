# @nx-extend/shadcn-ui

<a href="https://www.npmjs.com/package/@nx-extend/shadcn-ui" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/shadcn-ui" alt="@nx-extend/shadcn-ui NPM package">
</a>

**Nx plugin for working with [shadcn/ui](https://ui.shadcn.com/)**.

## Features

- Add shadcn/ui components to your Nx workspace
- Automatic setup of UI library and utilities
- Tailwind CSS integration
- Theme customization support
- Add individual or all components at once

## Setup

### Install

```sh
npm install -D @nx-extend/shadcn-ui
nx g @nx-extend/shadcn-ui:init
```

### Configure Tailwind

After installation, update your app's `tailwind.config.ts` to:

```ts
import { buildConfig } from '../libs/<lib directory>/src/tailwind.config'

export default buildConfig(__dirname)
```

### Remix Integration

If you are using Remix, you can import `global.css` directly:

```tsx
import stylesheet from '@<scope>/<utils lib name>/global.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]
```

## Usage

### Add Component

Add a single component to your UI library:

```sh
nx add-component <ui lib name> button
```

### Add All Components

Add all available shadcn/ui components:

```sh
nx add-component <ui lib name>
```

## Updating the Theme

The generated `global.css` uses the default shadcn/ui theme. Using the shadcn/ui theme editor, you can effortlessly apply a different theme.

Explore available themes here: https://ui.shadcn.com/themes

## Available Components

shadcn/ui provides a wide range of beautifully designed components including:
- Buttons, inputs, and forms
- Cards, dialogs, and modals
- Dropdowns and menus
- Navigation components
- Data tables
- And many more

Visit https://ui.shadcn.com/docs/components for the full list of available components.
