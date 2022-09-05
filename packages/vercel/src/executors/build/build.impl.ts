import { readJsonFile, writeJsonFile } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'

import type { ExecutorContext } from '@nrwl/devkit'

export interface ExecutorSchema {
  projectId: string
  orgId: string
  debug?: boolean
}

export function buildExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]

  if (!targets['build-next']) {
    throw new Error(`"${context.projectName}" is missing the original "build-next" target!`)
  }

  if (!targets['build-next']?.options?.outputPath) {
    throw new Error('"build-next" target has no "outputPath" configured!')
  }

  // First make sure the .vercel/project.json exists
  writeJsonFile('./.vercel/project.json', {
    'projectId': options.projectId,
    'orgId': options.orgId,
    'settings': {
      'createdAt': new Date().getTime(),
      'framework': 'nextjs',
      'devCommand': null,
      'installCommand': 'echo \'\'',
      'buildCommand': `nx build-next ${context.projectName} --prod`,
      'outputDirectory': `${targets['build-next']?.options?.outputPath}/.next`,
      'rootDirectory': null,
      'directoryListing': false,
      'nodeVersion': '16.x'
    }
  })

  const { success } = execCommand(buildCommand([
    'npx vercel build',
    `--output ${targets['build-next']?.options?.outputPath}/.vercel/output`,

    options.debug && '--debug'
  ]))

  if (success) {
    writeJsonFile(`${targets['build-next']?.options?.outputPath}/.vercel/project.json`, readJsonFile('./.vercel/project.json'))
  }

  return Promise.resolve({ success })
}

export default buildExecutor
