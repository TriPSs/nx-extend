import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot, runTasksInSerial,
  Tree
} from '@nx/devkit'
import { NormalizedSchema, normalizeOptions } from '@nx-extend/core'
import * as path from 'path'

import type { ReactEmailSchema } from './schema'

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  })
}

export default async function (host: Tree, options: ReactEmailSchema) {
  const normalizedOptions = normalizeOptions(host, options)

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      serve: {
        executor: '@nx-extend/react-email:serve',
        options: {}
      },
      export: {
        executor: '@nx-extend/react-email:export',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`
        },
        configurations: {
          production: {
            pretty: false
          }
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  addFiles(host, normalizedOptions)
  await formatFiles(host)

  return runTasksInSerial(
    addDependenciesToPackageJson(
      host,
      {},
      {
        '@react-email/components': '0.0.19',
        'react-email': '2.1.4'
      }
    )
  )
}
