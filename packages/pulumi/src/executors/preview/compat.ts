import { convertNxExecutor } from '@nx/devkit'

import previewExecutor from './preview.impl'

export default convertNxExecutor(previewExecutor)
