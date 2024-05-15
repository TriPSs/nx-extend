import { convertNxExecutor } from '@nx/devkit'

import { endToEndRunner } from './run.impl'

export default convertNxExecutor(endToEndRunner)
