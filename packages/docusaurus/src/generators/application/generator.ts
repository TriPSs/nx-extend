import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  applyChangesToString,
  ChangeType,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  runTasksInSerial,
  Tree
} from '@nx/devkit'
import * as path from 'path'

import { ApplicationGeneratorSchema } from './schema'

interface NormalizedSchema extends ApplicationGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: ApplicationGeneratorSchema
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
    name,
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

function updateGitIgnore(host: Tree) {
  const gitIgnorePath = '.gitignore'

  if (!host.exists(gitIgnorePath)) return

  const gitIgnoreSource = host.read(gitIgnorePath, 'utf-8')?.trimRight() ?? ''

  const ignorePatterns = ['.docusaurus/', '.cache-loader/'].filter(
    (ip) => !gitIgnoreSource.includes(ip)
  )

  if (!ignorePatterns.length) return

  const updatedGitIgnore = applyChangesToString(gitIgnoreSource, [
    {
      type: ChangeType.Insert,
      index: gitIgnoreSource.length,
      text: `

# Generated Docusaurus files
${ignorePatterns.join('\n')}`
    }
  ])

  host.write(gitIgnorePath, updatedGitIgnore)
}

function updatePrettierIgnore(host: Tree) {
  const prettierIgnorePath = '.prettierignore'

  if (!host.exists(prettierIgnorePath)) return

  const prettierIgnoreSource =
    host.read(prettierIgnorePath, 'utf-8')?.trimRight() ?? ''

  const ignorePattern = '.docusaurus/'

  if (prettierIgnoreSource.includes(ignorePattern)) return

  const updatedPrettierIgnore = applyChangesToString(prettierIgnorePath, [
    {
      type: ChangeType.Insert,
      index: prettierIgnoreSource.length,
      text: `\n${ignorePattern}`
    }
  ])

  host.write(prettierIgnorePath, updatedPrettierIgnore)
}

export async function applicationGenerator(
  host: Tree,
  options: ApplicationGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options)
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nx-extend/docusaurus:browser',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`
        }
      },
      serve: {
        executor: '@nx-extend/docusaurus:dev-server',
        options: {
          port: 3000
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })
  addFiles(host, normalizedOptions)
  updateGitIgnore(host)
  updatePrettierIgnore(host)
  const installTask = addDependenciesToPackageJson(
    host,
    {
      '@docusaurus/core': '3.4.0',
      '@docusaurus/preset-classic': '3.4.0',
      '@mdx-js/react': '^3.0.0',
      'clsx': '^2.0.0',
      'prism-react-renderer': '^2.3.0',
      'react': '^18.0.0',
      'react-dom': '^18.0.0'
    },
    {
      '@docusaurus/module-type-aliases': '3.4.0',
      '@docusaurus/tsconfig': '3.4.0',
      '@docusaurus/types': '3.4.0',
      'typescript': '~5.2.2'
    }
  )
  if (!normalizedOptions.skipFormat) {
    await formatFiles(host)
  }

  return runTasksInSerial(installTask)
}
