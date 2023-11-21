import { ExecutorContext, parseTargetString, readTargetOptions } from '@nx/devkit'
import { readCachedProjectGraph } from '@nx/workspace/src/core/project-graph'

export function getOutputDirectoryFromBuildTarget(context: ExecutorContext, buildTarget: string): string | undefined {
  const targetString = parseTargetString(buildTarget, readCachedProjectGraph())
  const targetOptions = readTargetOptions(targetString, context)
  const outputDirectory = targetOptions?.outputPath

  if (!outputDirectory && targetOptions?.buildTarget) {
    return getOutputDirectoryFromBuildTarget(context, targetOptions?.buildTarget)
  }

  return outputDirectory
}
