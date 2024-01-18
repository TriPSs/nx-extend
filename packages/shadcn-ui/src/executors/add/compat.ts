import { convertNxExecutor } from '@nx/devkit'

import { addExecutor } from './add.impl'

export default convertNxExecutor(addExecutor)
