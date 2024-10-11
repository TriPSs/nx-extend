import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  detectPackageManager,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot, runTasksInSerial,
  Tree, workspaceRoot
} from '@nx/devkit'
import { NormalizedSchema, normalizeOptions } from '@nx-extend/core'
import { createStrapi } from 'create-strapi-app'
import * as crypto from 'crypto'
import * as path from 'path'

import type { StrapiGeneratorSchema } from './schema'

import packageJson from '../../../package.json'
import { machineID } from '../../utils/machine-id'

// Base off https://github.com/strapi/strapi/blob/main/packages/generators/app/src/index.ts#L19
function generateStrapi(options: NormalizedSchema) {
  const version = packageJson.dependencies['@strapi/strapi']
  const packageManager = detectPackageManager()

  if (packageManager === 'bun') {
    throw new Error('Bun is not supported!')
  }

  return createStrapi({
    name: options.projectName,
    rootPath: options.projectRoot,
    packageManager: packageManager,
    database: {
      client: 'sqlite',
      connection: {
        filename: '.tmp/data.db',
      },
    },
    // disable quickstart run app after creation
    runApp: false,
    // use package.json version as strapiVersion (all packages have the same version);
    strapiVersion: version,
    isQuickstart: true,
    packageJsonStrapi: {
      template: undefined,
      starter: undefined
    },
    uuid: (process.env.STRAPI_UUID_PREFIX || '') + crypto.randomUUID(),
    docker: process.env.DOCKER === 'true',
    deviceId: machineID(),
    tmpPath: path.resolve(workspaceRoot, 'tmp', options.projectName),
    installDependencies: false,
    dependencies: {
      '@strapi/strapi': version,
      '@strapi/plugin-users-permissions': version,
      'better-sqlite3': '11.3.0'
    },
    devDependencies: {},
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

  // TODO:: Remove scripts we do not support from package.json

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
