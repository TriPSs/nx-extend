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
      `${utilsLibName}/src/tailwind.config.js`,
      `${utilsLibName}/src/global.css`,
      `${utilsLibName}/src/cn.ts`,
      'components.json'
    )).not.toThrow()
  })

})
