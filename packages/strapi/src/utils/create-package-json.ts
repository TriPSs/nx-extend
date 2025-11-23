import { detectPackageManager, readCachedProjectGraph, readJsonFile, writeJsonFile } from '@nx/devkit'
import { createLockFile, createPackageJson as generatePackageJson } from '@nx/js'
import { existsSync, writeFileSync } from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'

import type { ExecutorContext } from '@nx/devkit'

export async function createPackageJson(
  outputPath: string,
  projectRoot: string,
  context: ExecutorContext,
  generateLockFile: boolean
) {
  const { root } = context.projectsConfigurations.projects[context.projectName]

  let existingDeps = {}
  // User can define its own root (Same CMS multiple apps)
  if (root !== projectRoot && existsSync(`${projectRoot}/package.json`)) {
    const { dependencies = {} } = readJsonFile(`${projectRoot}/package.json`)

    existingDeps = dependencies
  }

  const packageJson = generatePackageJson(
    context.projectName,
    readCachedProjectGraph(),
    {
      root: context.root,
      isProduction: true,
      skipPackageManager: true
    }
  )

  if (!packageJson.scripts) {
    packageJson.scripts = {}
  }

  packageJson.scripts.start = 'strapi start'

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  // Merge existing deps with new deps
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...existingDeps
  }

  writeJsonFile(`${outputPath}/package.json`, packageJson)

  if (generateLockFile) {
    writeFileSync(
      `${outputPath}/${getLockFileName(detectPackageManager())}`,
      createLockFile(packageJson, readCachedProjectGraph()),
      {
        encoding: 'utf-8'
      }
    )
  }
}
