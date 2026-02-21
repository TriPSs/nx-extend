# @nx-extend/translations

<a href="https://www.npmjs.com/package/@nx-extend/translations" rel="nofollow">
  <img src="https://badgen.net/npm/v/@nx-extend/translations" alt="@nx-extend/translations NPM package">
</a>

**Nx plugin to extract, push, pull and translate your [FormatJS](https://formatjs.io/) projects**.

## Features

- Extract translations from FormatJS/React Intl projects
- Push translations to translation providers (SimpleLocalize)
- Pull translations from providers
- Automatic translation using DeepL or Google Translate
- Configurable through `.translationsrc.json`
- Nx plugin for automatic target generation

## Setup

### Install

```sh
npm install -D @nx-extend/translations
nx g @nx-extend/translations:add
```

## Usage

### Configuration File

Create a `.translationsrc.json` file in your project root:

```json
{
  "extends": "../.translationsrc.json",
  "projectName": "Project name in the provider",
  "projectId": "id in the provider",
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

### Extract Translations

Extract translation strings from your source code:

```sh
nx extract-translations <project-name>
```

### Push Translations

Push extracted translations to your translation provider:

```sh
nx push-translations <project-name>
```

### Pull Translations

Pull translations from your translation provider:

```sh
nx pull-translations <project-name>
```

### Translate

Automatically translate missing translations:

```sh
nx translate <project-name>
```

## Nx Plugin

Add the plugin to your `nx.json` to automatically generate targets for projects with `.translationsrc.json`:

```json
{
  "plugins": [
    {
      "plugin": "@nx-extend/translations/plugin"
    }
  ]
}
```

This will add the following targets to all projects with a `.translationsrc.json` file:
- `extract-translations`
- `push-translations`
- `pull-translations`
- `translate`

## Configuration Options

### Root Configuration

Options that are the same across projects can be placed in the root `.translationsrc.json`:

| Option                | Type       | Description                                                  |
|-----------------------|------------|--------------------------------------------------------------|
| **`provider`**        | `string`   | Translation provider to use (e.g., `simplelocalize`)        |
| **`outputDirectory`** | `string`   | Directory to output translations to                          |
| **`outputLanguages`** | `string`   | Path to output available languages JSON                      |
| **`defaultLanguage`** | `string`   | Default language code                                        |
| **`translator`**      | `string`   | Translation service to use (e.g., `deepl`)                   |
| **`translatorOptions`** | `object` | Options for the translator service                          |
| **`publishAfterPush`** | `boolean` | Whether to publish after pushing to provider                |
| **`autoTranslate`**   | `boolean`  | Whether to automatically translate missing strings          |
| **`languages`**       | `string[]` | List of language codes to support                            |

### Project Configuration

| Option           | Type     | Description                           |
|------------------|----------|---------------------------------------|
| **`projectName`** | `string` | Project name in the translation provider |
| **`projectId`**  | `string` | Project ID in the translation provider   |
| **`extends`**    | `string` | Path to extend configuration from        |
