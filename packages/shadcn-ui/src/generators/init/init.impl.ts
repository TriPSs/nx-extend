import {
  addDependenciesToPackageJson,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments, readProjectConfiguration,
  runTasksInSerial,
  Tree, updateProjectConfiguration, writeJson
} from '@nx/devkit'
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils'
import { Linter } from '@nx/eslint'
import { addTsConfigPath } from '@nx/js'
import { libraryGenerator } from '@nx/react'
import { join } from 'path'

import type { ShadecnUiSchema } from './schema'

function cleanupLib(tree: Tree, libDirectory: string) {
  // Remove the unneeded files
  tree.delete(`${libDirectory}/package.json`)
  tree.delete(`${libDirectory}/src/index.ts`)
  const libFiles = tree.children(`${libDirectory}/src/lib`)

  for (const file of libFiles) {
    tree.delete(`${libDirectory}/src/lib/${file}`)
  }
}

function addFilesToUtilsLib(host: Tree, libDirectory: string) {
  generateFiles(host, join(__dirname, 'files-utils'), libDirectory, {
    template: ''
  })
}

function getLibRoot(host: Tree, fileName: string) {
  return joinPathFragments(
    getWorkspaceLayout(host).libsDir,
    fileName
  )
}

export default async function (tree: Tree, options: ShadecnUiSchema) {
  const uiLibOptions = await determineProjectNameAndRootOptions(tree, {
    name: options.uiName,
    projectType: 'library',
    directory: getLibRoot(tree, options.uiName)
  })

  await libraryGenerator(tree, {
    name: options.uiName,
    skipFormat: true,
    style: 'css',
    linter: Linter.EsLint,
    directory: uiLibOptions.projectRoot
  })

  const utilsLibOptions = await determineProjectNameAndRootOptions(tree, {
    name: options.utilsName,
    projectType: 'library',
    directory: getLibRoot(tree, options.utilsName)
  })

  await libraryGenerator(tree, {
    name: options.utilsName,
    skipFormat: true,
    style: 'css',
    linter: Linter.EsLint,
    directory: utilsLibOptions.projectRoot
  })

  addTsConfigPath(tree, `${uiLibOptions.importPath}/*`, [`${uiLibOptions.projectRoot}/src/*`])
  addTsConfigPath(tree, `${utilsLibOptions.importPath}/*`, [`${utilsLibOptions.projectRoot}/src/*`])
  cleanupLib(tree, uiLibOptions.projectRoot)
  cleanupLib(tree, utilsLibOptions.projectRoot)

  addFilesToUtilsLib(tree, `${getLibRoot(tree, options.utilsName)}/src`)

  writeJson(tree, 'components.json', {
    '$schema': 'https://ui.shadcn.com/schema.json',
    'style': 'default',
    'rsc': false,
    'tailwind': {
      'config': join(utilsLibOptions.projectRoot, 'tailwind.config.js'),
      'css': join(utilsLibOptions.projectRoot, 'global.css'),
      'baseColor': 'neutral',
      'cssVariables': true
    },
    'aliases': {
      'components': uiLibOptions.importPath,
      'utils': utilsLibOptions.importPath
    }
  })

  updateProjectConfiguration(tree, uiLibOptions.projectName, {
    ...readProjectConfiguration(tree, uiLibOptions.projectName),
    targets: {
      'add-component': {
        executor: '@nx-extend/shadcn-ui:add'
      }
    }
  })

  return runTasksInSerial(
    addDependenciesToPackageJson(
      tree,
      {
        'class-variance-authority': '^0.7.0',
        'clsx': '^2.1.1',
        'lucide-react': '^0.395.0',
        'tailwind-merge': '^2.3.0',
        'tailwindcss-animate': '^1.0.7'
      },
      {
        tailwindcss: '^3.4.6'
      }
    )
  )
}
