import { ExecutorContext, readJsonFile, writeJsonFile } from '@nrwl/devkit'
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { createPackageJson } from '@nrwl/workspace/src/utilities/create-package-json'
import { fileExists } from '@nrwl/workspace/src/utils/fileutils'
import * as fs from 'fs'
import { join } from 'path'

import type { WebpackExecutorOptions } from '@nrwl/webpack/src/executors/webpack/schema'

export const generatePackageJson = (
  context: ExecutorContext,
  options: WebpackExecutorOptions,
  outFile: string
) => {
  const { root } = context.workspace.projects[context.projectName]

  const packageJson = createPackageJson(context.projectName, readCachedProjectGraph(), {
    root: context.root,
    projectRoot: root
  })

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
    const dependenciesName = externalDependencies.map((x) => x.match(re2)[0].replace(/"/gm, ''))

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

  writeJsonFile(`${options.outputPath}/package.json`, packageJson)
}
