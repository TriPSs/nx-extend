# NX - GCP Functions

Create new function
> This is not implemented yet

- `nx generate @nx-extend/gcp-functions:init --trigger http`
- `nx generate @nx-extend/gcp-functions:init --trigger event --triggerValue yourEvent`

Build your function, example schematic:

```json
{
  "builder": "@nx-extend/gcp-functions:build",
  "options": {
    "outputPath": "dist/apps/functions/function-name",
    "main": "apps/functions/function-name/src/function-name.function.ts",
    "yamlConfig": "apps/functions/function-name/src/environments/production.yaml",
    "tsConfig": "apps/functions/function-name/tsconfig.app.json"
  },
  "configurations": {
    "production": {
      "optimization": true,
      "extractLicenses": false,
      "inspect": false
    }
  }
}
```

Deploy your function, example schematic:

```json
{
  "builder": "@nx-extend/gcp-functions:deploy",
  "options": {
    "functionName": "function-name",
    "trigger": "http",
    "region": "europe-west1",
    "project": "your-project",
    "envVarsFile": "apps/functions/function-name/src/environments/production.yaml"
  }
}
```
