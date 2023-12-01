import { addProjectConfiguration, readProjectConfiguration } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'

import type { Tree } from '@nx/devkit'

import update from './change-function-gen'

describe('change-function-gen migration', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    addProjectConfiguration(tree, 'genOne', {
      root: 'genOne',
      targets: {
        deploy: {
          executor: '@nx-extend/gcp-functions:deploy',
          options: {
            functionName: 'test',
            envVarsFile: `test/src/environments/production.yaml`,
            entryPoint: 'test'
          }
        }
      }
    })

    addProjectConfiguration(tree, 'genTwo', {
      root: 'genTwo',
      targets: {
        deploy: {
          executor: '@nx-extend/gcp-functions:deploy',
          options: {
            functionName: 'test',
            envVarsFile: `test/src/environments/production.yaml`,
            entryPoint: 'test',
            gen: 2
          }
        }
      }
    })

    await update(tree)

    expect(readProjectConfiguration(tree, 'genOne')).toEqual(expect.objectContaining({
      root: 'genOne',
      targets: {
        deploy: {
          executor: '@nx-extend/gcp-functions:deploy',
          options: {
            functionName: 'test',
            envVarsFile: `test/src/environments/production.yaml`,
            entryPoint: 'test',
            gen: 1
          }
        }
      }
    }))

    expect(readProjectConfiguration(tree, 'genTwo')).toEqual(expect.objectContaining({
      root: 'genTwo',
      targets: {
        deploy: {
          executor: '@nx-extend/gcp-functions:deploy',
          options: {
            functionName: 'test',
            envVarsFile: `test/src/environments/production.yaml`,
            entryPoint: 'test'
          }
        }
      }
    }))
  })
})
