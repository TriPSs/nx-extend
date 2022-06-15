import { ExecutorContext } from '@nrwl/devkit'
import run from '@jamesives/github-pages-deploy-action'
import { TestFlag } from '@jamesives/github-pages-deploy-action/lib/constants'

const {
  GITHUB_WORKSPACE = '',
  GH_PAGES_ACCESS_TOKEN
} = process.env

export interface ExecutorSchema {
  branch?: string
}

export async function deployExecutor(
  options: ExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!GH_PAGES_ACCESS_TOKEN) {
    throw new Error('No "GH_PAGES_ACCESS_TOKEN" is set!')
  }

  const { targets } = context.workspace.projects[context.projectName]

  if (!targets?.build?.options?.outputPath) {
    throw new Error('No build target configured!')
  }

  const {
    branch = 'gh-pages'
  } = options

  try {
    await run({
      token: GH_PAGES_ACCESS_TOKEN,
      branch,
      isTest: TestFlag.NONE,
      silent: false,
      workspace: GITHUB_WORKSPACE,
      folder: targets?.build?.options?.outputPath,
      repositoryName: 'JamesIves/github-pages-deploy-action'
    })

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false
    }
  }
}
