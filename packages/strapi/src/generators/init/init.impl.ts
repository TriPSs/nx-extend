import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot, runTasksInSerial,
  Tree, workspaceRoot
} from '@nx/devkit'
import { NormalizedSchema, normalizeOptions } from '@nx-extend/core'
import generateNew from '@strapi/generate-new/dist/generate-new'
import hasYarn from '@strapi/generate-new/dist/utils/has-yarn'
import machineID from '@strapi/generate-new/dist/utils/machine-id'
import * as crypto from 'crypto'
import * as path from 'path'

import type { StrapiGeneratorSchema } from './schema'

import packageJson from '../../../package.json'

// Base off https://github.com/strapi/strapi/blob/main/packages/generators/app/src/index.ts#L19
function generateStrapi(options: NormalizedSchema) {
  return generateNew({
    rootPath: options.projectRoot,
    name: options.projectName,
    // disable quickstart run app after creation
    runQuickstartApp: false,
    // use package.json version as strapiVersion (all packages have the same version);
    strapiVersion: packageJson.dependencies['@strapi/strapi'],
    debug: false,
    quick: true,
    packageJsonStrapi: {
      template: undefined,
      starter: undefined
    },
    uuid: (process.env.STRAPI_UUID_PREFIX || '') + crypto.randomUUID(),
    docker: process.env.DOCKER === 'true',
    deviceId: machineID(),
    tmpPath: path.resolve(workspaceRoot, 'tmp', options.projectName),
    // use yarn if available and --use-npm isn't true
    useYarn: hasYarn(),
    installDependencies: false,
    strapiDependencies: [
      '@strapi/strapi',
      '@strapi/plugin-users-permissions',
      '@strapi/plugin-i18n'
    ],
    additionalsDependencies: {},
    useTypescript: true
  })
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}

export default async function (host: Tree, options: StrapiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options)

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      serve: {
        executor: '@nx-extend/strapi:serve',
        options: {}
      },
      build: {
        executor: '@nx-extend/strapi:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          tsConfig: `${normalizedOptions.projectRoot}/tsConfig.json`
        },
        configurations: {
          production: {
            production: true
          }
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  await generateStrapi(normalizedOptions)

  addFiles(host, normalizedOptions)
  await formatFiles(host)

  return runTasksInSerial(
    addDependenciesToPackageJson(
      host,
      {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        'react-router-dom': '5.3.4',
        'styled-components': '5.3.3'
      },
      {}
    )
  )
}
