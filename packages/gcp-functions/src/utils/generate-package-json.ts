import {
  detectPackageManager,
  ExecutorContext,
  logger,
  readCachedProjectGraph,
  readJsonFile,
  writeJsonFile
} from '@nx/devkit'
import { createLockFile, createPackageJson } from '@nx/js'
import * as fs from 'fs'
import { getLockFileName } from 'nx/src/plugins/js/lock-file/lock-file'
import { fileExists } from 'nx/src/utils/fileutils'
import { join } from 'path'

import type { WebpackExecutorOptions } from '@nx/webpack/src/executors/webpack/schema'

export const generatePackageJson = (
  context: ExecutorContext,
  options: WebpackExecutorOptions,
  outFile: string,
  omitOptionalDependencies = true,
  generateLockFile?: boolean
) => {
  const { root } = context.workspace.projects[context.projectName]

  const packageJson = createPackageJson(
    context.projectName,
    readCachedProjectGraph(),
    {
      root: context.root,
      isProduction: omitOptionalDependencies,
      skipPackageManager: true
    }
  )

  if (!packageJson.main) {
    packageJson.main = options.outputFileName || 'main.js'
  }

  if (omitOptionalDependencies) {
    delete packageJson.devDependencies
  }

  const dependencies = {}
  const buildFile = fs.readFileSync(outFile, 'utf8')
  const re2 = /"(.*)"/gm
  const externalDependencies = buildFile.match(/require\("[a-zA-Z0-9@./-]+"\)/gm)

  // Get the package version from the root
  if (externalDependencies) {
    const workspacePackages = readJsonFile(join(context.root, 'package.json'))
    const dependenciesName = externalDependencies.map((x) =>
      x.match(re2)[0].replace(/"/gm, '')
    )

    console.log('\n')
    dependenciesName.forEach((dep) => {
      let depName = dep

      let packageIsDefined = depName in workspacePackages.dependencies

      if (!packageIsDefined) {
        while (depName.includes('/')) {
          const depNameParts = depName.split('/')
          // Remove the last part
          depNameParts.pop()

          depName = depNameParts.join('/')

          // Check if it exists now
          packageIsDefined = depName in workspacePackages.dependencies

          if (packageIsDefined) {
            // Break the loop if it exists
            break
          }
        }
      }

      if (packageIsDefined) {
        dependencies[depName] = workspacePackages.dependencies[depName]
      } else {
        logger.warn(`Could not add "${dep}", is it added to the package.json?`)
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
      `${options.outputPath}/${getLockFileName(detectPackageManager())}`,
      createLockFile(packageJson, readCachedProjectGraph()),
      {
        encoding: 'utf-8'
      }
    )
  }
}
