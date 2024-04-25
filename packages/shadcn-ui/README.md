# @nx-extend/shadcn-ui

<a href="https://www.npmjs.com/package/@nx-extend/shadcn-ui" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/shadcn-ui" alt="@nx-extend/shadcn-ui NPM package">
</a>

**Nx plugin for working with [shadcn/ui](https://ui.shadcn.com/)**.

## Setup

### Install

```sh
npm install -D @nx-extend/shadcn-ui
nx g @nx-extend/shadcn-ui:init
```

After installation update your APPs `tailwind.config.ts` to this:

```ts
import { buildConfig } from '../libs/<lib directory>/src/tailwind.config'

export default buildConfig(__dirname)
```

If you are using Remix you can import `global.css` directly like:

```tsx
import stylesheet from '@<scope>/<utils lib name>/global.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]
```

## Usage

### Add

```sh
nx add <ui lib name> button
```

### All all components

```sh
nx add <ui lib name>
```

## Updating the theme

The generated `global.css` uses the default shadcn/ui theme.
Using the shadcn/ui theme editor, you can effortlessly apply a different theme.
Explore available themes here: https://ui.shadcn.com/themes
