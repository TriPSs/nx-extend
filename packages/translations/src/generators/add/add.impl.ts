import {
  offsetFromRoot,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
  writeJson
} from '@nrwl/devkit'
import { join } from 'path'

import { Schema } from './schema'

export default async function (
  host: Tree,
  options: Schema
) {
  const app = readProjectConfiguration(host, options.target)

  createAppConfigFile(host, app, options.target)

  updateProjectConfiguration(host, options.target, {
    ...app,
    targets: {
      ...app.targets,

      'extract-translations': {
        executor: '@nx-extend/translations:extract',
        options: {}
      },
      'pull-translations': {
        executor: '@nx-extend/translations:pull',
        options: {}
      },
      'push-translations': {
        executor: '@nx-extend/translations:push',
        options: {}
      },
      'translate': {
        executor: '@nx-extend/translations:translate',
        options: {}
      }
    }
  })
}

export function createAppConfigFile(host: Tree, app: ProjectConfiguration, target: string) {
  const configFileLocation = '.translationsrc.json'

  writeJson(host, join(app.root, configFileLocation), {
    extends: `${offsetFromRoot(app.root)}${configFileLocation}`,
    projectName: target
  })

  // Check if root file exists
  if (!host.exists(configFileLocation)) {
    writeJson(host, configFileLocation, {
      provider: 'none',
      outputDirectory: '<projectRoot>/src/translations',
      outputLanguages: '<projectRoot>/src/translations/locales.json',
      defaultLanguage: 'en',
      translator: 'none',
      translatorOptions: {},
      languages: [
        'en'
      ]
    })
  }
}
