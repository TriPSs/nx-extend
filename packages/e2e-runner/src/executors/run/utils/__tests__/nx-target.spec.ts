import { NxTarget } from '../nx-target'

describe('NxTarget', () => {
  it('should inject env variables in "checkUrl" option', () => {
    process.env.SUPER_FAKE_PORT = '3000'

    const target = new NxTarget({
      target: 'fake',
      checkUrl: 'http://LOCALHOST:$SUPER_FAKE_PORT/$DOES_NOT_EXIST'
    })

    // @ts-expect-error is a private prop
    expect(target.options.checkUrl).toEqual('http://LOCALHOST:3000/$DOES_NOT_EXIST')
  })
})
