import * as fs from 'fs'
import { join } from 'path'
import { fileExists, readJsonFile, writeToFile } from '@nrwl/workspace/src/utils/fileutils'
import { createPackageJson } from '@nrwl/workspace/src/utilities/create-package-json'
import { ProjectGraph } from '@nrwl/workspace/src/core/project-graph'

import { OUT_FILENAME } from '@nrwl/node/src/utils/config'
import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'

export const generatePackageJson = (
  projectName: string,
  graph: ProjectGraph,
  options: BuildNodeBuilderOptions,
  outFile: string,
  workspaceRoot: string
) => {
  const packageJson = createPackageJson(projectName, graph, options)
  packageJson.main = OUT_FILENAME
  delete packageJson.devDependencies

  const dependencies = {}
  const buildFile = fs.readFileSync(outFile, 'utf8')
  const re2 = /"(.*)"/gm
  const externalDependencies = buildFile.match(/require\("(.*)"\)/gm)

  // Get the package version from the root
  if (externalDependencies) {
    const workspacePackages = readJsonFile(join(workspaceRoot, 'package.json'))
    const dependenciesName = externalDependencies.map((x) => x.match(re2)[0].replace(/"/gm, ''))

    dependenciesName.forEach((dep) => {
      const packageIsDefined = dep in workspacePackages.dependencies
      dependencies[dep] = packageIsDefined
        ? workspacePackages.dependencies[dep]
        : '*'
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

  writeToFile(join(options.outputPath, 'package.json'), JSON.stringify(packageJson, null, 2))
}
