import { writeJsonFile } from '@nrwl/devkit'
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { createPackageJson as generatePackageJson } from '@nrwl/workspace/src/utilities/create-package-json'

import type { ExecutorContext } from '@nrwl/devkit'

export async function createPackageJson(
  outputPath: string,
  projectRoot: string,
  context: ExecutorContext
) {
  const packageJson = generatePackageJson(
    context.projectName,
    readCachedProjectGraph(),
    {
      root: context.root,
      projectRoot
    }
  )

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }

  packageJson.scripts.start = 'strapi start'

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }

  writeJsonFile(`${outputPath}/package.json`, packageJson)
}
