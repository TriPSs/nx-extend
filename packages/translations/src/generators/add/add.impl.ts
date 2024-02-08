import {
  offsetFromRoot,
  ProjectConfiguration, readNxJson,
  readProjectConfiguration,
  Tree, updateNxJson,
  updateProjectConfiguration,
  writeJson
} from '@nx/devkit'
import { join } from 'path'

export interface AddSchema {
  target: string

  addPlugin?: boolean
}

export default async function (host: Tree, options: AddSchema) {
  const app = readProjectConfiguration(host, options.target)

  createAppConfigFile(host, app, options.target)

  options.addPlugin ??= process.env.NX_ADD_PLUGINS !== 'false'
  if (options.addPlugin) {
    addPlugin(host)
  }

  if (!options.addPlugin) {
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
        translate: {
          executor: '@nx-extend/translations:translate',
          options: {}
        }
      }
    })
  }
}

export function createAppConfigFile(
  host: Tree,
  app: ProjectConfiguration,
  target: string
) {
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
      languages: ['en']
    })
  }
}

export function addPlugin(tree: Tree) {
  const nxJson = readNxJson(tree)
  nxJson.plugins ??= []

  for (const plugin of nxJson.plugins) {
    if (
      typeof plugin === 'string'
        ? plugin === '@nx-extend/translations/plugin'
        : plugin.plugin === '@nx-extend/translations/plugin'
    ) {
      return
    }
  }

  nxJson.plugins.push('@nx-extend/translations/plugin')

  updateNxJson(tree, nxJson)
}
