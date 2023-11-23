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
  normalizeOptions
} from '@nx-extend/core'
import { join } from 'path'
import { which } from 'shelljs'

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, join(__dirname, 'files'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}

export default async function (
  host: Tree,
  rawOptions: DefaultGeneratorOptions
) {
  if (!which('terraform')) {
    throw new Error('Terraform is not installed!')
  }

  const options = normalizeOptions(host, rawOptions)

  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
      plan: {
        executor: '@nx-extend/terraform:plan',
        options: {
          planFile: 'defaultplan',
          ciMode: true
        }
      },
      // initialize instead of init as nx init creates a new nx project
      initialize: {
        executor: '@nx-extend/terraform:init',
        options: {
          ciMode: true
        }
      },
      apply: {
        executor: '@nx-extend/terraform:apply',
        options: {
          planFile: 'defaultplan',
          ciMode: true,
          autoApproval: false
        }
      },
      destroy: {
        executor: '@nx-extend/terraform:destroy',
        options: {
          planFile: 'defaultplan',
          ciMode: true,
          autoApproval: false
        }
      }
    },
    tags: options.parsedTags
  })

  addFiles(host, options)

  await formatFiles(host)
}
