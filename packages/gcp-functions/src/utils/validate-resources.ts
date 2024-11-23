import { Gen, ValidMemory } from '../types'

const gen2Memory: ValidMemory[] = ['16384MB', '32768MB']
const minimumCPU: Record<ValidMemory, number> = {
  '128MB': 0.083,
  '256MB': 0.167,
  '512MB': 0.333,
  '1024MB': 0.583,
  '2048MB': 1,
  '4096MB': 2,
  '8192MB': 2,
  '16384MB': 4,
  '32768MB': 8
}
const docsLink = 'https://cloud.google.com/functions/docs/configuring/memory'

export const validateResources = ({
  cpu,
  memory,
  gen
}: {
  cpu: number
  memory: ValidMemory
  gen: Gen
}) => {
  if (gen2Memory.includes(memory) && gen === 1) {
    throw new Error(
      `Setting memory to "${memory}" is not supported when gen is 2.

       See ${docsLink} for more information.
      `
    )
  }

  if (cpu < minimumCPU[memory]) {
    throw new Error(
      `CPU value of ${cpu} is not enough for memory of ${memory}.
      
       See ${docsLink} for more information
      `
    )
  }
}
