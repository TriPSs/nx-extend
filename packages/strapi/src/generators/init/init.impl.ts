import {
  addProjectConfiguration,
  formatFiles,
  Tree,
  workspaceRoot
} from '@nx/devkit'
import { NormalizedSchema, normalizeOptions } from '@nx-extend/core'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import type { StrapiGeneratorSchema } from './schema'

const run = promisify(execFile)

async function generateStrapi(options: NormalizedSchema) {
  const cli = require.resolve('create-strapi/bin/index.js')

  await run(process.execPath, [
    cli,
    options.projectRoot,
    '--quickstart',
    '--no-run',
    '--ts',
    '--no-install',
    '--skip-cloud',
    '--non-interactive',
    '--no-git-init'
  ], {
    cwd: workspaceRoot
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

  await formatFiles(host)
}
