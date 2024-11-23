import { validateResources } from './validate-resources'
import { Gen, ValidMemory } from '../types'

describe('validateResources', () => {
  it('should throw an error if memory is gen2 and gen is 1', () => {
    const resources = {
      cpu: 4,
      memory: '16384MB' as const,
      gen: 1 as const
    }

    expect(() => validateResources(resources)).toThrow()
  })

  it('should throw an error if CPU is less than minimum required for memory', () => {
    const resources = {
      cpu: 0.5,
      memory: '1024MB' as const,
      gen: 2 as const
    }

    expect(() => validateResources(resources)).toThrow()
  })

  it('should not throw an error for valid resources', () => {
    const resources = {
      cpu: 1,
      memory: '1024MB' as ValidMemory,
      gen: 2 as Gen
    }

    expect(() => validateResources(resources)).not.toThrow()
  })

  it('should not throw an error for gen2 memory and gen 2', () => {
    const resources = {
      cpu: 4,
      memory: '16384MB' as const,
      gen: 2 as Gen
    }

    expect(() => validateResources(resources)).not.toThrow()
  })

  it('should not throw an error for minimum CPU and memory', () => {
    const resources = {
      cpu: 0.083,
      memory: '128MB' as const,
      gen: 2 as const
    }

    expect(() => validateResources(resources)).not.toThrow()
  })

  it('should not throw an error if CPU is higher than minimum required for memory', () => {
    const resources = {
      cpu: 1,
      memory: '256MB' as const,
      gen: 1 as const
    }

    expect(() => validateResources(resources)).not.toThrow()
  })
})
