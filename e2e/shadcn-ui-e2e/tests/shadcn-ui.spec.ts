import { ensureNxProject } from '../../utils/workspace'
import { runNxCommandAsync } from '../../utils/run-nx-command-async'
import { checkFilesExist, readJson } from '@nx/plugin/testing'

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

    const componentsJSON = readJson('components.json')
    expect(componentsJSON.tailwind.config).toEqual(`${utilsLibName}/src/tailwind.config.ts`)
    expect(componentsJSON.tailwind.css).toEqual(`${utilsLibName}/src/global.css`)
    expect(componentsJSON.aliases.hooks).toEqual(`@proj/${uiLibName}/hooks`)

    const tsconfigJSON = readJson('tsconfig.base.json')
    expect(tsconfigJSON.compilerOptions.paths[`@proj/${uiLibName}`][0]).toEqual(`${uiLibName}/src`)
    expect(tsconfigJSON.compilerOptions.paths[`@proj/${utilsLibName}`][0]).toEqual(`${utilsLibName}/src`)
  })

})
