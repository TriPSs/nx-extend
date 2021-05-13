import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing'

describe('traduora e2e', () => {

  it('should upload all translations', async (done) => {
    // const plugin = uniq('traduora')
    // ensureNxProject('@nx-extend/translations', 'dist/packages/traduora')
    // await runNxCommandAsync(`generate @nx-extend/translations:traduora ${plugin}`)
    //
    // const result = await runNxCommandAsync(`build ${plugin}`)
    // expect(result.stdout).toContain('Executor ran')
    //
    // done()
  })

  it('should download all translations', async (done) => {

  })

  it('should download all translations and use source as fallback', async (done) => {

  })

})
