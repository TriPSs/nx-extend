import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree
} from '@nx/devkit'
import { initGenerator as jsInitGenerator } from '@nx/js'
import * as path from 'path'

import { devDependencies } from '../../../package.json'
import { GcpDeploymentManagerGeneratorSchema } from './schema'

interface NormalizedSchema extends GcpDeploymentManagerGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(
  host: Tree,
  options: GcpDeploymentManagerGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(host).appsDir,
    projectDirectory
  )
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : []

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags
  }
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, path.join(__dirname, 'files-http'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}

export default async function (
  host: Tree,
  options: GcpDeploymentManagerGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options)

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      lint: {
        executor: '@nrwl/linter:eslint',
        options: {}
      },
      test: {
        executor: '@nx/jest:jest',
        options: {
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.ts`,
          passWithNoTests: true
        }
      },
      build: {
        executor: '@nx-extend/gcp-functions:build',
        options: {
          generateLockFile: true,
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          main: `${normalizedOptions.projectRoot}/src/main.ts`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.app.json`,
          assets: []
        },
        configurations: {
          production: {
            optimization: true,
            extractLicenses: false,
            inspect: false
          }
        }
      },
      deploy: {
        executor: '@nx-extend/gcp-functions:deploy',
        options: {
          functionName: normalizedOptions.projectName,
          envVarsFile: `${normalizedOptions.projectRoot}/src/environments/production.yaml`,
          entryPoint: names(normalizedOptions.name).className
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  addFiles(host, normalizedOptions)
  await formatFiles(host)

  await jsInitGenerator(host, {
    skipFormat: true
  })

  return runTasksInSerial(
    addDependenciesToPackageJson(
      host,
      {},
      {
        '@google-cloud/functions-framework': devDependencies['@google-cloud/functions-framework']
      }
    )
  )
}
