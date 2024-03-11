import { convertNxExecutor } from '@nx/devkit'

import validateExecutor from './validate.impl'

export default convertNxExecutor(validateExecutor)
