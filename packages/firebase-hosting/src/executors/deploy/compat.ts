import { convertNxExecutor } from '@nx/devkit'

import { deployExecutor } from './deploy.impl'

export default convertNxExecutor(deployExecutor)
