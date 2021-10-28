import { convertNxExecutor } from '@nrwl/devkit'

import { deleteExecutor } from './delete.impl'

export default convertNxExecutor(deleteExecutor)
