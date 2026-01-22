import { ExecutorContext } from '@nx/devkit'
import { buildCommand } from '@nx-extend/core'
import { execSync } from 'child_process'
import { which } from 'shelljs'

export interface ExecutorOptions {
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
  list: boolean
  select: boolean
  create: boolean
  remove: boolean

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

    const { sourceRoot } = context.projectsConfigurations.projects[context.projectName]
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
      list,
      select,
      create,
      remove
    } = options

    let env = {}
    if (ciMode) {
      env = {
        TF_IN_AUTOMATION: true,
        TF_INPUT: 0
      }
    }

    let workspaceArgs: string[] = [];

    if (command === 'workspace') {
      const actions = [select, create, remove, list].filter(Boolean);

      if (actions.length < 1) {
        throw new Error('At least one action is required for workspace command, select, create, remove or list');
      }

      if (actions.length > 1) {
        throw new Error('Only one action is allowed for workspace command, select, create, remove or list');
      }

      if (!list && !workspace){
        throw new Error('Workspace name is required for workspace command, select, create, remove or list');
      }

      if (select) {
        workspaceArgs.push(`select ${workspace}`);
      }

      if (create) {
        workspaceArgs.push(`new ${workspace}`);
      }

      if (remove) {
        workspaceArgs.push(`delete ${workspace}`);
      }

      if (list) {
        workspaceArgs.push(`list`);
      }

      workspaceArgs.push(workspace);
    }
    
    let jsonBackendConfig = backendConfig
    if (typeof jsonBackendConfig === 'string') {
      jsonBackendConfig = JSON.parse(jsonBackendConfig)
    }

    execSync(
      buildCommand([
        'terraform',
        command,
        ...workspaceArgs,
        ...jsonBackendConfig.map(
          (config) => `-backend-config="${config.key}=${config.name}"`
        ),
        command === 'plan' && planFile && `-out ${planFile}`,
        command === 'plan' && varFile && `--var-file ${varFile}`,
        command === 'plan' && varString && `--var ${varString}`,
        command === 'destroy' && autoApproval && '-auto-approve',
        command === 'apply' && autoApproval && '-auto-approve',
        command === 'apply' && planFile,
        command === 'apply' && varString && `--var ${varString}`,
        command === 'fmt' && '--recursive',
        command === 'fmt' && !formatWrite && '--check --list',
        command === 'init' && upgrade && '-upgrade',
        command === 'init' && migrateState && '-migrate-state',
        command === 'init' && reconfigure && '-reconfigure',
        command === 'providers' && lock && 'lock',
        command === 'test' && varFile && `--var-file ${varFile}`,
        command === 'test' && varString && `--var ${varString}`,
        command === 'workspace' && workspace && select && `select ${workspace}`,
        command === 'workspace' && workspace && create && `new ${workspace}`,
        command === 'workspace' && workspace && remove && `delete ${workspace}`,
        command === 'workspace' && list && `list`
      ]),
      {
        cwd: sourceRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          ...env
        }
      }
    )

    return Promise.resolve({ success: true })
  }
}
