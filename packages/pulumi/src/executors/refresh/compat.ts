import { convertNxExecutor } from '@nx/devkit'

import previewExecutor from './refresh.impl'

export default convertNxExecutor(previewExecutor)
