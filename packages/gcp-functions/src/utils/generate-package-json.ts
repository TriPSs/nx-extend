import {
  ExecutorContext,
  readJsonFile,
  writeJsonFile
} from '@nx/devkit'
import { createLockFile, createPackageJson } from '@nx/js'
import { readCachedProjectGraph } from '@nx/workspace/src/core/project-graph'
import { fileExists } from '@nx/workspace/src/utils/fileutils'
import * as fs from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'
import { join } from 'path'

import type { WebpackExecutorOptions } from '@nx/webpack/src/executors/webpack/schema'

export const generatePackageJson = (
  context: ExecutorContext,
  options: WebpackExecutorOptions,
  outFile: string,
  generateLockFile
) => {
  const { root } = context.workspace.projects[context.projectName]

  const packageJson = createPackageJson(
    context.projectName,
    readCachedProjectGraph(),
    {
      root: context.root,
      isProduction: true
    }
  )

  if (!packageJson.main) {
    packageJson.main = options.outputFileName || 'main.js'
  }

  delete packageJson.devDependencies

  const dependencies = {}
  const buildFile = fs.readFileSync(outFile, 'utf8')
  const re2 = /"(.*)"/gm
  const externalDependencies = buildFile.match(/require\("(.*?)"\)/gm)

  // Get the package version from the root
  if (externalDependencies) {
    const workspacePackages = readJsonFile(join(context.root, 'package.json'))
    const dependenciesName = externalDependencies.map((x) =>
      x.match(re2)[0].replace(/"/gm, '')
    )

    dependenciesName.forEach((dep) => {
      let depName = dep

      let packageIsDefined = depName in workspacePackages.dependencies

      if (!packageIsDefined) {
        if (depName.includes('/')) {
          depName = depName.split('/').shift()
          packageIsDefined = depName in workspacePackages.dependencies
        }
      }

      if (packageIsDefined) {
        dependencies[depName] = workspacePackages.dependencies[depName]
      } else {
        console.warn(`Could not add "${dep}", is it added to the package.json?`)
      }
    })
  }

  const projectPackageJson = join(root, 'package.json')

  const originalPackageJson = fileExists(projectPackageJson)
    ? readJsonFile(projectPackageJson)
    : { dependencies: {} }

  packageJson.dependencies = {
    ...originalPackageJson.dependencies,
    ...dependencies
  }

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }

  if (originalPackageJson.main) {
    packageJson.main = originalPackageJson.main
  }

  writeJsonFile(`${options.outputPath}/package.json`, packageJson)

  if (generateLockFile) {
    fs.writeFileSync(
      `${options.outputPath}/${getLockFileName()}`,
      createLockFile(packageJson),
      {
        encoding: 'utf-8'
      }
    )
  }
}
