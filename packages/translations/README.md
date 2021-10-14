# NX - Translations

Extract/upload translations from your NX projects

## Steps

1. Create a `.translationsrc.json` inside your project

Example config

```json
{
  "provider": "traduora",
  "baseUrl": "http://localhost:8090",
  "outputDirectory": "<projectRoot>/src/translations",
  "outputLanguages": "<projectRoot>/src/translations/locales.json",
  "defaultLanguage": "en",
  "extractor": "formatjs",
  "translator": "free-deepl",
  "translatorOptions": {
    "formality": "less"
  },
  "languages": [
    "en",
    "de",
    "nl",
    "pl",
    "fr"
  ]
}
```
