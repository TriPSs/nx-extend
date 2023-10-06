import * as githubCore from '@actions/core'
import { buildCommand, execCommand, execPackageManagerCommand, isCI, USE_VERBOSE_LOGGING } from '@nx-extend/core'
import { existsSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nx/devkit'

import { getOutputDirectoryFromBuildTarget } from '../../utils/get-output-directory-from-build-target'
import { vercelToken } from '../../utils/vercel-token'

export interface DeployOptions {
  buildTarget?: string
  regions?: string
}

export async function deployExecutor(
  options: DeployOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]

  let outputDirectory = ''

  if (options.buildTarget) {
    outputDirectory = getOutputDirectoryFromBuildTarget(context, options.buildTarget)
  } else {
    const projectVercelBuildTarget = Object.keys(targets).find((target) => (
      targets[target].executor === '@nx-extend/vercel:build'
    ))

    if (projectVercelBuildTarget) {
      let projectBuildTarget = targets[projectVercelBuildTarget]?.options?.buildTarget || 'build-next'
      if (!projectBuildTarget.includes(':')) {
        projectBuildTarget = `${context.projectName}:${projectBuildTarget}`
      }

      outputDirectory = getOutputDirectoryFromBuildTarget(context, projectBuildTarget)
    }
  }

  if (!outputDirectory) {
    throw new Error(`Could not find the builds output path!`)
  }

  if (!existsSync(join(outputDirectory, '.vercel/project.json'))) {
    throw new Error('No ".vercel/project.json" found in dist folder! ')
  }

  const { success, output } = execPackageManagerCommand(buildCommand([
    'vercel deploy --prebuilt',
    context.configurationName === 'production' && '--prod',
    vercelToken && `--token=${vercelToken}`,
    options.regions && `--regions=${options.regions}`,

    USE_VERBOSE_LOGGING && '--debug'
  ]), {
    cwd: outputDirectory
  })

  // When running in GitHub CI add the URL of the deployment as summary
  if (isCI()) {
    // Add comment instead of summary (Look at https://github.com/mshick/add-pr-comment)
    const parts = output.split('\n')

    const url = parts.find(
      (part) =>
        part.trim().startsWith('https://') &&
        part.trim().endsWith('.vercel.app')
    )

    if (url) {
      await githubCore.summary
        .addLink('Vercel URL', url.trim())
        .write()

      await githubCore.setOutput('url', url)
    }
  }

  return { success }
}

export default deployExecutor
