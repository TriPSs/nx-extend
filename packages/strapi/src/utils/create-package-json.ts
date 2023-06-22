import { writeJsonFile } from '@nx/devkit'
import { createLockFile } from '@nx/js'
import { readCachedProjectGraph } from '@nx/workspace/src/core/project-graph'
import { writeFileSync } from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'
import { createPackageJson as generatePackageJson } from 'nx/src/plugins/js/package-json/create-package-json'

import type { ExecutorContext } from '@nx/devkit'

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
    writeFileSync(
      `${outputPath}/${getLockFileName()}`,
      createLockFile(packageJson),
      {
        encoding: 'utf-8'
      }
    )
  }
}
