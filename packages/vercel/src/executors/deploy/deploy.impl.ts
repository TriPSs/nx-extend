import { buildCommand, execCommand } from '@nx-extend/core'
import { existsSync } from 'fs'
import { join } from 'path'

import type { BuildOptions } from '../build/build.impl'
import type { ExecutorContext } from '@nrwl/devkit'

export interface DeployOptions {
  debug?: boolean
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

    options.debug && '--debug'
  ]), {
    cwd: targets[buildTarget].options.outputPath
  })

  // TODO:: Get url from output
  console.log("TST", output)
  // Production:

  return { success }
}

export default deployExecutor
