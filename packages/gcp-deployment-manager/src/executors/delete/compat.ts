import { convertNxExecutor } from '@nx/devkit'

import { deleteExecutor } from './delete.impl'

export default convertNxExecutor(deleteExecutor)
