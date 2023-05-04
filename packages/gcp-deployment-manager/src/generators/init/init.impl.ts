import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree
} from '@nx/devkit'
import {
  DefaultGeneratorOptions,
  NormalizedSchema,
  normalizeOptions} from '@nx-extend/core'
import { join } from 'path'

export interface Options extends DefaultGeneratorOptions {
  project?: string
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, join(__dirname, 'files'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}

export default async function (host: Tree, rawOptions: Options) {
  const options = normalizeOptions(host, rawOptions)
  const file = `deployment.yml`

  const targetOptions = {
    file,
    name: options.projectName,
    project: undefined
  }

  if (rawOptions.project) {
    targetOptions.project = rawOptions.project
  }

  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
      create: {
        executor: '@nx-extend/gcp-deployment-manager:create',
        options: targetOptions
      },
      update: {
        executor: '@nx-extend/gcp-deployment-manager:update',
        options: targetOptions
      },
      delete: {
        executor: '@nx-extend/gcp-deployment-manager:delete',
        options: targetOptions
      }
      // TODO:: Create "deploy" that checks if recourse exists, if not create it else update it
    },
    tags: options.parsedTags
  })

  addFiles(host, options)

  await formatFiles(host)
}
