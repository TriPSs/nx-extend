import * as githubCore from '@actions/core'
import { buildCommand, execCommand } from '@nx-extend/core'
import { existsSync } from 'fs'
import { join } from 'path'

import type { ExecutorContext } from '@nrwl/devkit'

import { isGithubCi } from '../../utils/is-github-ci'
import { verceToken } from '../../utils/verce-token'

export interface DeployOptions {
  debug?: boolean
  regions?: string
}

export async function deployExecutor(
  options: DeployOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { targets } = context.workspace.projects[context.projectName]

  const vercelBuildTarget = Object.keys(targets).find((target) => targets[target].executor === '@nx-extend/vercel:build')
  const buildTarget = targets[vercelBuildTarget]?.options?.buildTarget || 'build-next'

  if (!targets[buildTarget]?.options?.outputPath) {
    throw new Error(`"${buildTarget}" target has no "outputPath" configured!`)
  }

  if (!existsSync(join(targets[buildTarget].options.outputPath, '.vercel/project.json'))) {
    throw new Error('No ".vercel/project.json" found in dist folder! ')
  }

  const { success, output } = execCommand(buildCommand([
    'npx vercel deploy --prebuilt',
    context.configurationName === 'production' && '--prod',
    verceToken && `--token=${verceToken}`,
    options.regions && `--regions=${options.regions}`,

    options.debug && '--debug'
  ]), {
    cwd: targets[buildTarget].options.outputPath
  })

  // When running in GitHub CI add the URL of the deployment as summary
  if (isGithubCi) {
    const parts = output.split('\n')

    const url = parts.find((part) => part.trim().startsWith('https://') && part.trim().endsWith('.vercel.app'))

    if (url) {
      githubCore.summary
        .addLink('Vercel URL', url.trim())
    }
  }

  return { success }
}

export default deployExecutor
