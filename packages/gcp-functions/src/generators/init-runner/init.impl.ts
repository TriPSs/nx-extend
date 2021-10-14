import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit'
import * as path from 'path'
import { GcpDeploymentManagerGeneratorSchema } from './schema'

interface NormalizedSchema extends GcpDeploymentManagerGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(
  host: Tree,
  options: GcpDeploymentManagerGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : []

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags
  }
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(
    host,
    path.join(__dirname, 'files-runner'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    }
  )
}

export default async function (
  host: Tree,
  options: GcpDeploymentManagerGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options)

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: normalizedOptions.projectRoot,
    targets: {
      _build: {
        executor: '@nrwl/node:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          main: `${normalizedOptions.projectRoot}/src/main.ts`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.app.json`
        }
      },
      serve: {
        executor: '@nrwl/node:execute',
        options: {
          buildTarget: `${normalizedOptions.projectName}:_build`
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  addFiles(host, normalizedOptions)

  await formatFiles(host)
}
