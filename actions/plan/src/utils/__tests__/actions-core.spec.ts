import * as core from '@actions/core'

describe('@actions/core', () => {
  it.each([
    'debug',
    'endGroup',
    'exportVariable',
    'getBooleanInput',
    'getInput',
    'getMultilineInput',
    'info',
    'isDebug',
    'setFailed',
    'setOutput',
    'startGroup'
  ] as const)('provides %s', (method) => {
    expect(typeof core[method]).toBe('function')
  })

  it('provides the job summary API', () => {
    expect(core.summary).toBeDefined()
  })
})
