import { convertNxExecutor } from '@nrwl/devkit'

import { createExecutor } from './create.impl'

export default convertNxExecutor(createExecutor)
