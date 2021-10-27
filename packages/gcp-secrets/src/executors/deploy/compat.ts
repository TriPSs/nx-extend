import { convertNxExecutor } from '@nrwl/devkit'

import { deployExecutor } from './deploy.impl'

export default convertNxExecutor(deployExecutor)
