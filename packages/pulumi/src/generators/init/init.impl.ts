import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  names,
  offsetFromRoot,
  readJsonFile,
  Tree
} from '@nrwl/devkit'
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial'
import { buildCommand, DefaultGeneratorOptions, execCommand, NormalizedSchema, normalizeOptions } from '@nx-extend/core'
import { unlinkSync } from 'fs'
import { join } from 'path'
import { which } from 'shelljs'

import { getCloudTemplateName, Provider } from '../../utils/provider'

export interface InitOptions extends DefaultGeneratorOptions {
  provider?: Provider
  secretsProvider?: string
  login?: string
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  generateFiles(
    tree,
    join(__dirname, 'files'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    }
  )
}

function generateNewPulumiProject(tree: Tree, options: NormalizedSchema & InitOptions): GeneratorCallback {
  return () => {
    const template = getCloudTemplateName(options.provider)

    const { success } = execCommand(buildCommand([
      `pulumi new ${template}`,
      `--name=${options.projectName}`,
      `--dir=${options.projectRoot}`,
      options.secretsProvider && `--secrets-provider=${options.secretsProvider}`,
      '--generate-only',
      '--yes',
      '--force'
    ]))

    if (!success) {
      throw new Error('Unable to create new Pulumi project!')
    }
  }
}

function loginToPulumi(tree: Tree, options: NormalizedSchema & InitOptions): GeneratorCallback {
  return () => {
    if (!options.login) {
      return
    }

    if (options.login.startsWith('file://')) {
      options.login = `file://${tree.root}/${options.projectRoot}/${options.login.replace('file://', '')}`
    }

    const { success } = execCommand(buildCommand([
      'pulumi login',
      options.login
    ]))

    if (!success) {
      throw new Error('Unable to login!')
    }
  }
}

function addPulumiDeps(tree: Tree, options: NormalizedSchema & InitOptions): GeneratorCallback {
  return () => {
    const packageJson = readJsonFile(`${options.projectRoot}/package.json`)

    if (packageJson) {
      addDependenciesToPackageJson(
        tree,
        {},
        packageJson.dependencies || {}
      )()
    }
  }
}

function cleanupProject(tree: Tree, options: NormalizedSchema & InitOptions): GeneratorCallback {
  return () => {
    unlinkSync(join(tree.root, `${options.projectRoot}/.gitignore`))
    unlinkSync(join(tree.root, `${options.projectRoot}/package.json`))
  }
}

export default async function (
  tree: Tree,
  rawOptions: InitOptions
) {
  if (!which('pulumi')) {
    throw new Error('pulumi is not installed!')
  }

  const options = normalizeOptions(tree, rawOptions) as NormalizedSchema & InitOptions

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: options.projectRoot,
    targets: {
      up: {
        executor: '@nx-extend/pulumi:up',
        options: {}
      },
      preview: {
        executor: '@nx-extend/pulumi:preview',
        options: {}
      }
    },
    tags: options.parsedTags
  })

  addFiles(tree, options)

  await formatFiles(tree)

  return runTasksInSerial(
    generateNewPulumiProject(tree, options),
    loginToPulumi(tree, options),
    addPulumiDeps(tree, options),
    cleanupProject(tree, options)
  )
}
