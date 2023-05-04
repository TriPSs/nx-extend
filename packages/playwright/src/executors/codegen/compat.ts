import { convertNxExecutor } from '@nx/devkit'

import { codegenExecutor } from './codegen.impl'

export default convertNxExecutor(codegenExecutor)
