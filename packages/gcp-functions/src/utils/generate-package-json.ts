import * as fs from 'fs'
import { join } from 'path'
import { fileExists, readJsonFile, writeJsonFile } from '@nrwl/workspace/src/utils/fileutils'
import { createPackageJson } from '@nrwl/workspace/src/utilities/create-package-json'
import { ProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'

export const generatePackageJson = (
  projectName: string,
  graph: ProjectGraph,
  options: BuildNodeBuilderOptions,
  outFile: string,
  workspaceRoot: string
) => {
  const packageJson = createPackageJson(projectName, graph, options)
  packageJson.main = options.outputFileName
  delete packageJson.devDependencies

  const dependencies = {}
  const buildFile = fs.readFileSync(outFile, 'utf8')
  const re2 = /"(.*)"/gm
  const externalDependencies = buildFile.match(/require\("(.*?)"\)/gm)

  // Get the package version from the root
  if (externalDependencies) {
    const workspacePackages = readJsonFile(join(workspaceRoot, 'package.json'))
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

  const projectPackageJson = join(options.projectRoot, 'package.json')

  const originalPackageJson = fileExists(projectPackageJson)
    ? readJsonFile(projectPackageJson)
    : { dependencies: {} }

  packageJson.dependencies = {
    ...originalPackageJson.dependencies,
    ...dependencies
  }

  writeJsonFile(`${options.outputPath}/package.json`, packageJson)
}
