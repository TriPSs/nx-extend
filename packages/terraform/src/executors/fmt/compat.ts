import { convertNxExecutor } from '@nx/devkit'

import fmtExecutor from './fmt.impl'

export default convertNxExecutor(fmtExecutor)
