# NX Translations

Extract/upload translations from your NX projects

Example extract

```json
{
  "targets": {
    "extract-translations": {
      "builder": "@nx-extend/translations:extract",
      "options": {
        "defaultLanguage": "en",
        "withLibs": true
      }
    }
  }
}
```

Example upload (Transifex)

Transifex requires you to have a `.transifex.json` inside the apps directory. Example:
```json
{
  "organization": "org name",
  "project": "project name",
  "recourse": "recourse name",
  "outputDirectory": "<projectRoot>/src/translations",
  "sourceFile": "<projectRoot>/src/translations/en.json",
  "sourceLang": "en",
  "createResourceIfNeeded": true
}

```

```json
{
  "targets": {
    "pull-translations": {
      "builder": "@nx-extend/translations:pull",
      "options": {
        "provider": "transifex"
      }
    },
    "push-translations": {
      "builder": "@nx-extend/translations:push",
      "options": {
        "provider": "transifex"
      }
    }
  }
}
```
