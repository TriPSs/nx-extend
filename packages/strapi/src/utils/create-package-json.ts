import { writeJsonFile } from '@nrwl/devkit'
import { createLockFile, createPackageJson as generatePackageJson } from '@nrwl/js'
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { writeFileSync } from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'

import type { ExecutorContext } from '@nrwl/devkit'

export async function createPackageJson(
  outputPath: string,
  projectRoot: string,
  context: ExecutorContext,
  generateLockFile: boolean
) {
  const packageJson = generatePackageJson(
    context.projectName,
    readCachedProjectGraph(),
    {
      root: context.root,
      isProduction: true
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

  if (generateLockFile) {
    writeFileSync(`${outputPath}/${getLockFileName()}`, createLockFile(packageJson), {
      encoding: 'utf-8'
    })
  }
}
