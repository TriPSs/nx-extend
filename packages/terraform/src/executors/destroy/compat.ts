import { convertNxExecutor } from '@nx/devkit'

import applyExecutor from './destroy.impl'

export default convertNxExecutor(applyExecutor)
