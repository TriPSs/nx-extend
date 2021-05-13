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
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
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
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  }
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  )
}

export default async function (
  host: Tree,
  options: GcpDeploymentManagerGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options)
  const file = `deployment.yml`

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: normalizedOptions.projectRoot,
    targets: {
      create: {
        executor: '@nx-extend/gcp-deployment-manager:create',
        options: {
          file
        }
      },
      update: {
        executor: '@nx-extend/gcp-deployment-manager:update',
        options: {
          file
        }
      },
      delete: {
        executor: '@nx-extend/gcp-deployment-manager:delete',
        options: {
          file
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  addFiles(host, normalizedOptions)

  await formatFiles(host)
}
