import { ExecutorContext } from '@nx/devkit'
import { execPackageManagerCommand } from '@nx-extend/core'
import { resolve } from 'node:path'

import { serveExecutor } from './serve.impl'

jest.mock('@nx-extend/core', () => ({
  buildCommand: jest.fn(() => 'strapi develop'),
  execPackageManagerCommand: jest.fn(async () => ({ success: true }))
}))

describe('serveExecutor project root', () => {
  const workspaceRoot = resolve('/workspace')
  const context: ExecutorContext = {
    root: workspaceRoot,
    cwd: resolve(workspaceRoot, 'apps/other'),
    isVerbose: false,
    nxJsonConfiguration: {},
    projectGraph: { nodes: {}, dependencies: {} },
    projectName: 'cms',
    projectsConfigurations: {
      version: 2,
      projects: {
        cms: { root: 'apps/cms' }
      }
    }
  }

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it.each([
    ['the configured project root', undefined, resolve(workspaceRoot, 'apps/cms')],
    ['a relative root override', 'shared/cms', resolve(workspaceRoot, 'shared/cms')],
    ['an absolute root override', resolve('/external/cms'), resolve('/external/cms')]
  ])('uses %s when invoked from a workspace subdirectory', async (_, root, expectedRoot) => {
    jest.spyOn(process, 'cwd').mockReturnValue(resolve(workspaceRoot, 'apps/other'))

    const result = await serveExecutor({ root }, context)

    expect(execPackageManagerCommand).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ cwd: expectedRoot })
    )
    expect(result).toEqual({ success: true })
  })
})
