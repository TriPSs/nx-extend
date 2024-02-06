# @nx-extend/translations

<a href="https://www.npmjs.com/package/@nx-extend/translations" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/translations" alt="@nx-extend/translations NPM package">
</a>

**Nx plugin to extract, push, pull and translate your [FormatJS](https://formatjs.io/) projects**.

## Setup

### Install

```sh
npm install -D @nx-extend/translations
nx g @nx-extend/translations:add
```

## Usage

### Build

#### Available options:

| name | type | default | description |
|------|------|---------|-------------|

### Serve

#### Available options:

| name | type | default | description |
|------|------|---------|-------------|

## Plugin

```json
{
  "plugins": [
    {
      "plugin": "@nx-extend/translations/plugin"
    }
  ]
}
```

Will add the `extract-translations`, `push-translations`, `pull-translations` and `translate` target to all projects with an `.translationsrc.json` in the root.

### Example `.translationsrc.json`

```json
{
  "extends": "../.translationsrc.json",
  "projectName": "Project name in the provider",
  "projectId": "id in the provider",

  // Options that are the same could go for example in the ".translationsrc.json" of the root.
  "provider": "simplelocalize",
  "outputDirectory": "<projectRoot>/src/translations",
  "outputLanguages": "<projectRoot>/src/translations/locales.json",
  "defaultLanguage": "en",
  "translator": "deepl",
  "translatorOptions": {
    "formality": "less",
    "fallbackToGooleTranslate": true
  },
  "publishAfterPush": true,
  "autoTranslate": true,
  "languages": [
    "en",
    "de",
    "nl",
    "pl",
    "fr",
    "ro",
    "da",
    "he",
    "sv"
  ]
}
```
