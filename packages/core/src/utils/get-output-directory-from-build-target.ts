import { ExecutorContext, parseTargetString, readCachedProjectGraph,readTargetOptions } from '@nx/devkit'

export function getOutputDirectoryFromBuildTarget(context: ExecutorContext, buildTarget: string): string | undefined {
  const targetString = parseTargetString(buildTarget, readCachedProjectGraph())
  const targetOptions = readTargetOptions(targetString, context)
  const outputDirectory = targetOptions?.outputPath

  if (!outputDirectory && targetOptions?.buildTarget) {
    return getOutputDirectoryFromBuildTarget(context, targetOptions?.buildTarget)
  }

  return outputDirectory
}
