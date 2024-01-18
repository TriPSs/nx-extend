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

import { devDependencies } from '../../../package.json'

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
  await libraryGenerator(tree, {
    name: options.uiName,
    skipFormat: true,
    style: 'css',
    linter: Linter.EsLint
  })

  const uiLibOptions = await determineProjectNameAndRootOptions(tree, {
    callingGenerator: '@nx-extend/shadcn-ui:init',
    name: options.uiName,
    projectType: 'library'
  })

  const uiRoot = getLibRoot(tree, uiLibOptions.projectRoot)
  addTsConfigPath(tree, `${uiLibOptions.importPath}/*`, [`${uiRoot}/src/*`])
  cleanupLib(tree, uiRoot)

  await libraryGenerator(tree, {
    name: options.utilsName,
    skipFormat: true,
    style: 'css',
    linter: Linter.EsLint
  })

  const utilsLibOptions = await determineProjectNameAndRootOptions(tree, {
    callingGenerator: '@nx-extend/shadcn-ui:init',
    name: options.utilsName,
    projectType: 'library'
  })

  const utilRoot = getLibRoot(tree, utilsLibOptions.projectRoot)
  addTsConfigPath(tree, `${utilsLibOptions.importPath}/*`, [`${utilRoot}/src/*`])
  cleanupLib(tree, utilRoot)

  addFilesToUtilsLib(tree, `${getLibRoot(tree, options.utilsName)}/src`)

  writeJson(tree, 'components.json', {
    '$schema': 'https://ui.shadcn.com/schema.json',
    'style': 'default',
    'rsc': false,
    'tailwind': {
      'config': join(utilRoot, 'tailwind.config.js'),
      'css': join(utilRoot, 'global.css'),
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
      add: {
        executor: '@nx-extend/shadcn-ui:add'
      }
    }
  })

  return runTasksInSerial(
    addDependenciesToPackageJson(
      tree,
      {
        'class-variance-authority': devDependencies['class-variance-authority'],
        'clsx': devDependencies['clsx'],
        'lucide-react': devDependencies['lucide-react'],
        'tailwind-merge': devDependencies['tailwind-merge'],
        'tailwindcss-animate': devDependencies['tailwindcss-animate']
      },
      {}
    )
  )
}
