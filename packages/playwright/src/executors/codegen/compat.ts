import { convertNxExecutor } from '@nrwl/devkit'

import { codegenExecutor } from './codegen.impl'

export default convertNxExecutor(codegenExecutor)
