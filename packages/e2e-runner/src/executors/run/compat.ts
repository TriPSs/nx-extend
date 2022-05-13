import { convertNxExecutor } from '@nrwl/devkit'

import { endToEndRunner } from './run.impl'

export default convertNxExecutor(endToEndRunner)
