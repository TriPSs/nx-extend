import * as fs from 'fs'
import { join } from 'path'
import { fileExists, readJsonFile, writeToFile } from '@nrwl/workspace/src/utils/fileutils'

import { BuildNodeBuilderOptions } from '@nrwl/node/src/utils/types'

export const generatePackageJson = (project: string, options: BuildNodeBuilderOptions, workspaceRoot: string) => {
  const dependencies = {}
  const buildFile = fs.readFileSync(`${options.outputPath}/main.js`, 'utf8')
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

  const packageJson = join(options.projectRoot, 'package.json')

  const originalPackageJson = fileExists(packageJson)
    ? readJsonFile(packageJson)
    : { dependencies: {} }

  originalPackageJson.dependencies = {
    ...originalPackageJson.dependencies,
    ...externalDependencies
  }

  writeToFile(join(options.outputPath, 'package.json'), JSON.stringify(originalPackageJson, null, 2))
}
