import {
  buildCommand,
  execCommand,
  USE_VERBOSE_LOGGING
} from '@nx-extend/core'
import { existsSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nx/devkit'

import { VERCEL_COMMAND, VERCEL_TOKEN } from '../../utils/constants'

export interface DeployOptions {
  regions?: string
  archive?: 'tgz'
  deployment?: 'preview' | 'production'
}

export async function deployExecutor(
  options: DeployOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root: projectRoot } = context.projectsConfigurations.projects[context.projectName]
  if (!existsSync(join(projectRoot, 'project.json'))) {
    throw new Error('No ".vercel/project.json" found in dist folder! ')
  }

  const { success, output } = execCommand(buildCommand([
    `${VERCEL_COMMAND} deploy --prebuilt`,
    (context.configurationName === 'production' || options.deployment === 'production') && '--prod',
    VERCEL_TOKEN && `--token=${VERCEL_TOKEN}`,
    options.regions && `--regions=${options.regions}`,
    options.archive && `--archive=${options.archive}`,

    USE_VERBOSE_LOGGING && '--debug'
  ]), {
    cwd: projectRoot
  })

  // TODO:: Bring back once we get everything working with @actions/core v3
  // When running in GitHub CI add the URL of the deployment as summary
  // if (isCI()) {
  //   // Add comment instead of summary (Look at https://github.com/mshick/add-pr-comment)
  //   const parts = output.split('\n')
  //
  //   const url = parts.find(
  //     (part) =>
  //       part.trim().startsWith('https://') &&
  //       part.trim().endsWith('.vercel.app')
  //   )
  //
  //   if (url) {
  //     await githubCore.summary
  //       .addLink('Vercel URL', url.trim())
  //       .write()
  //
  //     githubCore.setOutput('url', url)
  //   }
  // }

  return { success }
}

export default deployExecutor
