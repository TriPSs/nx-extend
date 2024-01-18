import { ensureNxProject } from '../../utils/workspace'
import { runNxCommandAsync } from '../../utils/run-nx-command-async'
import { checkFilesExist } from '@nx/plugin/testing'

describe('shadcn/ui e2e', () => {

  beforeAll(() => ensureNxProject([
    '@nx-extend/core:dist/packages/core',
    '@nx-extend/shadcn-ui:dist/packages/shadcn-ui'
  ]))

  const uiLibName = 'shadcn-ui/ui'
  const utilsLibName = 'shadcn-ui/utils'

  it('should be able to init', async () => {
    await runNxCommandAsync(`generate @nx-extend/shadcn-ui:init ${uiLibName} ${utilsLibName}`)

    expect(() => checkFilesExist(
      `${utilsLibName}/src/tailwind.config.ts`,
      `${utilsLibName}/src/global.css`,
      `${utilsLibName}/src/cn.ts`,
      `${utilsLibName}/src/index.ts`,
      'components.json'
    )).not.toThrow()
  })

  // it('should be able add a button', async () => {
  //   await runNxCommandAsync(`add ${uiLibName} button`)
  //
  //   expect(() => checkFilesExist(
  //     `${uiLibName}/src/button.tsx`,
  //   )).not.toThrow()
  // })

})
