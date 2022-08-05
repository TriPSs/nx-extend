import {
  addProjectConfiguration,
  formatFiles,
  getWorkspaceLayout,
  names,
  Tree
} from '@nrwl/devkit'
import { generateNewApp as generateStrapi } from '@strapi/generate-new'

import { StrapiGeneratorSchema } from './schema'

interface NormalizedSchema extends StrapiGeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(host: Tree, options: StrapiGeneratorSchema): NormalizedSchema {
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

export default async function (host: Tree, options: StrapiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options)
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      serve: {
        executor: '@nx-extend/strapi:serve'
      },
      build: {
        executor: '@nx-extend/strapi:build',
        configurations: {
          production: {
            production: true
          }
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })

  try {
    await generateStrapi(
      normalizedOptions.projectRoot,
      {
        quickstart: true,
        run: false,
        typescript: true
      }
    )
  } catch {
    // Sometimes an error happens installing the deps, project is still created correctly
    // TODO:: Better handle?
  }

  await formatFiles(host)
}
