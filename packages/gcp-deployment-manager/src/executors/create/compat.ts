import { convertNxExecutor } from '@nx/devkit'

import { createExecutor } from './create.impl'

export default convertNxExecutor(createExecutor)
