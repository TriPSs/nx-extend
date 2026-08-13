import { ExecutorContext } from '@nx/devkit'
import { execFileSync } from 'child_process'
import { which } from 'shelljs'
import * as path from 'path'
import { mkdirSync } from 'fs'

export interface ExecutorOptions {
  root?: string // Local target options override
  backendConfig?: { key: string; name: string }[]
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

    const env: Record<string, string> = {}
    if (ciMode) {
      env.TF_IN_AUTOMATION = 'true'
      env.TF_INPUT = '0'
    }

    if (cacheEnabled && cacheDir) {
      const resolvedCacheDir = path.isAbsolute(cacheDir) ? cacheDir : path.resolve(targetDirectory || '.', cacheDir)
      mkdirSync(resolvedCacheDir, { recursive: true })
      env.TF_PLUGIN_CACHE_DIR = resolvedCacheDir
    }

    let resolvedMirrorDir = mirrorDir
    if (mirror && !resolvedMirrorDir) {
      resolvedMirrorDir = path.resolve(targetDirectory || '.', '.terraform', 'providers')
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

    const jsonBackendConfig = backendConfig ?? []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processEnv = (globalThis as any).process?.env || {}
    const execEnv: Record<string, string> = {
      ...processEnv,
      ...env
    }

    // Handle provider lock and mirror commands
    if (command === 'providers' && lock && mirror) {
      const lockArgs = ['providers', 'lock']
      if (cacheEnabled) lockArgs.push('-enable-plugin-cache')
      platforms.forEach(p => lockArgs.push(`-platform=${p}`))

      execFileSync(
        'terraform',
        lockArgs,
        {
          cwd: targetDirectory,
          stdio: 'inherit',
          env: execEnv
        }
      )

      const mirrorArgs = ['providers', 'mirror']
      platforms.forEach(p => mirrorArgs.push(`-platform=${p}`))
      if (resolvedMirrorDir) mirrorArgs.push(resolvedMirrorDir)

      execFileSync(
        'terraform',
        mirrorArgs,
        {
          cwd: targetDirectory,
          stdio: 'inherit',
          env: execEnv
        }
      )
    } else {
      const args: string[] = [command, ...workspaceArgs]

      if (command === 'init') {
        jsonBackendConfig.forEach(config => args.push(`-backend-config=${config.key}=${config.name}`))
        if (upgrade) args.push('-upgrade')
        if (migrateState) args.push('-migrate-state')
        if (reconfigure) args.push('-reconfigure')
        if (lock === false) args.push('-lock=false')
      }

      if (command === 'plan') {
        if (planFile) args.push(`-out=${planFile}`)
        if (varFile) args.push(`-var-file=${varFile}`)
        if (varString) args.push('-var', varString)
        if (lock === false) args.push('-lock=false')
      }

      if (command === 'destroy') {
        if (autoApproval) args.push('-auto-approve')
      }

      if (command === 'apply') {
        if (autoApproval) args.push('-auto-approve')
        if (planFile) {
          args.push(planFile)
        } else {
          if (varFile) args.push(`-var-file=${varFile}`)
          if (varString) args.push('-var', varString)
        }
      }

      if (command === 'fmt') {
        args.push('-recursive')
        if (!formatWrite) args.push('-check', '-list=true')
      }

      if (command === 'providers') {
        if (lock) {
          args.push('lock')
          if (cacheEnabled) args.push('-enable-plugin-cache')
          platforms.forEach(p => args.push(`-platform=${p}`))
        }
        if (mirror) {
          args.push('mirror')
          platforms.forEach(p => args.push(`-platform=${p}`))
          if (resolvedMirrorDir) args.push(resolvedMirrorDir)
        }
      }

      if (command === 'test') {
        if (varFile) args.push(`-var-file=${varFile}`)
        if (varString) args.push('-var', varString)
      }

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
