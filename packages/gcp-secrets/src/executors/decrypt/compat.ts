import { convertNxExecutor } from '@nx/devkit'

import { decyrptExecutor } from './decrypt.impl'

export default convertNxExecutor(decyrptExecutor)
