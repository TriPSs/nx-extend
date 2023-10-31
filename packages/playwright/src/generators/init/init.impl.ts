import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree
} from '@nx/devkit'
import {
  DefaultGeneratorOptions,
  NormalizedSchema,
  normalizeOptions
} from '@nx-extend/core'
import { join } from 'path'

export interface Options extends DefaultGeneratorOptions {
  project?: string
}

export default async function (host: Tree, rawOptions: Options) {
  const options = normalizeOptions(host, rawOptions)

  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
      e2e: {
        executor: '@nx-extend/playwright:test',
        options: {}
      },
      codegen: {
        executor: '@nx-extend/playwright:codegen',
        options: {}
      }
    },
    tags: options.parsedTags
  })

  addFiles(host, options)

  await formatFiles(host)

  return runTasksInSerial(
    addDependenciesToPackageJson(
      host,
      {},
      {
        '@playwright/test': '^1.25.0',
        playwright: '^1.25.0'
      }
    )
  )
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, join(__dirname, 'files'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}
