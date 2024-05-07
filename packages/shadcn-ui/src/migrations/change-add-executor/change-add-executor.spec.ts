import { addProjectConfiguration, readProjectConfiguration } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'

import type { Tree } from '@nx/devkit'

import update from './change-add-executor'

describe('change-function-gen migration', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    addProjectConfiguration(tree, 'renamedAdd', {
      root: 'renamedAdd',
      targets: {
        addComponent: {
          executor: '@nx-extend/shadcn-ui:add'
        }
      }
    })

    addProjectConfiguration(tree, 'oldAdd', {
      root: 'oldAdd',
      targets: {
        add: {
          executor: '@nx-extend/shadcn-ui:add',
          options: {
            foo: 'bar'
          }
        }
      }
    })

    await update(tree)

    expect(readProjectConfiguration(tree, 'renamedAdd')).toEqual(expect.objectContaining({
      root: 'renamedAdd',
      targets: {
        addComponent: {
          executor: '@nx-extend/shadcn-ui:add'
        }
      }
    }))

    expect(readProjectConfiguration(tree, 'oldAdd')).toEqual(expect.objectContaining({
      root: 'oldAdd',
      targets: {
        'add-component': {
          executor: '@nx-extend/shadcn-ui:add',
          options: {
            foo: 'bar'
          }
        }
      }
    }))
  })
})
