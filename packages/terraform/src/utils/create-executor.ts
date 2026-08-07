import { ExecutorContext } from '@nx/devkit'
import { execFileSync } from 'child_process'
import { which } from 'shelljs'
import * as path from 'path'
import { mkdirSync } from 'fs'

export interface ExecutorOptions {
  root?: string // Local target options override
  backendConfig: { key: string; name: string }[]
  autoApproval: boolean
  planFile: string
  ciMode: boolean
  formatWrite: boolean
  upgrade: boolean
  migrateState: boolean
  lock: boolean
  varFile: string
  varString: string
  reconfigure: boolean
  workspace: string
  workspaceAction: 'select' | 'new' | 'delete' | 'list'
  cacheDir?: string
  cacheEnabled?: boolean
  mirror?: boolean
  mirrorDir?: string
  platforms?: string[]

  [key: string]: string | unknown
}

export function createExecutor(command: string) {
  return async function runExecutor(
    options: ExecutorOptions,
    context: ExecutorContext
  ): Promise<{ success: boolean }> {
    if (!which('terraform')) {
      throw new Error('Terraform is not installed!')
    }

    const projectName = context.projectName
    if (!projectName) {
      throw new Error('Project name is required in executor context')
    }

    const projectConfig = context.projectsConfigurations?.projects?.[projectName]
    const terraformRootValue = projectConfig && 'terraformRoot' in projectConfig
      ? (projectConfig as Record<string, unknown>).terraformRoot
      : undefined
    const projectTerraformRoot = typeof terraformRootValue === 'string'
      ? terraformRootValue
      : undefined
    const defaultSourceRoot = projectConfig?.sourceRoot

    const targetDirectory = options.root ??
                projectTerraformRoot ??
                defaultSourceRoot

    // Establish the absolute workspace root reliably
    const workspaceRoot = context.root
    // Combine path token expansion and backward-compatible resolution
    const resolveAndExpandPath = (pathStr: string | undefined): string | undefined => {
      if (!pathStr) return pathStr
      // Grab project relative root, default to empty string if missing
      const projRelativeRoot = projectConfig?.root || ''
      // Turn it into an absolute project path
      const absoluteProjectRoot = path.resolve(workspaceRoot, projRelativeRoot)
      // Global replace using regex to avoid single-instance string.replace bugs
      const expanded = pathStr
        .replace(/\{workspaceRoot\}/g, workspaceRoot)
        .replace(/\{projectRoot\}/g, absoluteProjectRoot)
      // If workspaceRoot token was used, resolve relative to workspaceRoot
      if (pathStr.includes('{workspaceRoot}')) {
        return path.resolve(workspaceRoot, expanded)
      }
      // If projectRoot token was used, it's already expanded
      if (pathStr.includes('{projectRoot}')) {
        return expanded
      }
      // For paths without tokens: return if absolute, otherwise resolve to projectRoot
      if (path.isAbsolute(expanded)) {
        return expanded
      }
      return path.resolve(absoluteProjectRoot, expanded)
    }


    const {
      backendConfig = [],
      planFile,
      ciMode,
      autoApproval,
      formatWrite,
      upgrade,
      migrateState,
      lock,
      varFile,
      varString,
      reconfigure,
      workspace,
      workspaceAction = 'select',
      cacheDir,
      cacheEnabled,
      mirror,
      mirrorDir,
      platforms = []
    } = options

    const env: Record<string, string | number | boolean> = {}
    if (ciMode) {
      env.TF_IN_AUTOMATION = true
      env.TF_INPUT = 0
    }

    if (cacheEnabled && cacheDir) {
      const resolvedCacheDir = resolveAndExpandPath(cacheDir)
      if (resolvedCacheDir) {
        mkdirSync(resolvedCacheDir, { recursive: true })
        env.TF_PLUGIN_CACHE_DIR = resolvedCacheDir
      }
    }

    let resolvedMirrorDir = mirrorDir ? resolveAndExpandPath(mirrorDir) : undefined
    if (mirror && !resolvedMirrorDir) {
      const projRelativeRoot = projectConfig?.root || ''
      const absoluteProjectRoot = path.resolve(workspaceRoot, projRelativeRoot)
      resolvedMirrorDir = path.resolve(absoluteProjectRoot, '.terraform', 'providers')
    }

    let workspaceArgs: string[] = [];

    if (command === 'workspace') {
      if (workspaceAction === 'list') {
        workspaceArgs.push(workspaceAction);
      } else {
        if (!workspace) {
          throw new Error('Workspace name is required for workspace command, select, new or delete');
        }
        workspaceArgs.push(workspaceAction, workspace);
      }
    }

    let jsonBackendConfig = backendConfig
    if (typeof jsonBackendConfig === 'string') {
      jsonBackendConfig = JSON.parse(jsonBackendConfig)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processEnv = (globalThis as any).process?.env || {}
    const execEnv = {
      ...processEnv,
      ...env
    }

    // Handle provider lock and mirror commands
    if (command === 'providers' && lock && mirror) {
      execFileSync(
        'terraform',
        [
          'providers',
          'lock',
          ...(cacheEnabled ? ['-enable-plugin-cache'] : []),
          ...(platforms.length > 0 ? platforms.map(p => `-platform=${p}`) : [])
        ],
        {
          cwd: targetDirectory,
          stdio: 'inherit',
          env: execEnv
        }
      )

      execFileSync(
        'terraform',
        [
          'providers',
          'mirror',
          ...(platforms.length > 0 ? platforms.map(p => `-platform=${p}`) : []),
          resolvedMirrorDir!
        ],
        {
          cwd: targetDirectory,
          stdio: 'inherit',
          env: execEnv
        }
      )
    } else {
      const args = [
        command,
        ...workspaceArgs,
        ...(command === 'init' ? jsonBackendConfig.map(
          (config) => `-backend-config=${config.key}=${config.name}`
        ) : []),
        command === 'plan' && planFile && `-out ${planFile}`,
        command === 'plan' && varFile && `--var-file ${varFile}`,
        command === 'plan' && varString && `--var ${varString}`,
        command === 'plan' && lock === false && '-lock=false',
        command === 'destroy' && autoApproval && '-auto-approve',
        command === 'apply' && autoApproval && '-auto-approve',
        command === 'apply' && planFile,
        command === 'apply' && varString && `--var ${varString}`,
        command === 'fmt' && '--recursive',
        command === 'fmt' && !formatWrite && '--check --list',
        command === 'init' && upgrade && '-upgrade',
        command === 'init' && migrateState && '-migrate-state',
        command === 'init' && reconfigure && '-reconfigure',
        command === 'init' && lock === false && '-lock=false',
        command === 'providers' && lock && 'lock',
        ...(command === 'providers' && lock && cacheEnabled ? ['-enable-plugin-cache'] : []),
        ...(command === 'providers' && lock && platforms.length > 0 ? platforms.map(p => `-platform=${p}`) : []),
        command === 'providers' && mirror && 'mirror',
        ...(command === 'providers' && mirror && platforms.length > 0 ? platforms.map(p => `-platform=${p}`) : []),
        command === 'providers' && mirror && resolvedMirrorDir,
        command === 'test' && varFile && `--var-file ${varFile}`,
        command === 'test' && varString && `--var ${varString}`
      ].filter((arg): arg is string => typeof arg === 'string' && arg !== '')

      execFileSync(
        'terraform',
        args,
        {
          cwd: targetDirectory,
          stdio: 'inherit',
          env: execEnv
        }
      )
    }

    return Promise.resolve({ success: true })
  }
}
