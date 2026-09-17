import { existsSync, writeFileSync } from 'fs'
import { dirname } from 'path'

import { execCommand } from '../exec'
import { getProjectGraph } from '../get-project-graph'

jest.mock('../exec', () => ({
  execCommand: jest.fn()
}))

const execCommandMock = execCommand as jest.MockedFunction<typeof execCommand>

describe('getProjectGraph', () => {
  it('reads the graph file instead of command output', () => {
    const graph = {
      nodes: {},
      dependencies: {}
    }
    let graphFile = ''

    execCommandMock.mockImplementation((command) => {
      graphFile = command.match(/--file="([^"]+)"/)?.[1] || ''
      writeFileSync(graphFile, JSON.stringify({ graph }))

      return 'Nx emitted a warning before the graph' as never
    })

    expect(getProjectGraph('/workspace', true)).toEqual(graph)
    expect(execCommandMock).toHaveBeenCalledWith(
      expect.stringContaining('nx graph --file='),
      {
        silent: true,
        cwd: '/workspace'
      }
    )
    expect(existsSync(dirname(graphFile))).toBe(false)
  })
})
