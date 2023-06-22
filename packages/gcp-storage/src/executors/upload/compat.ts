import { convertNxExecutor } from '@nx/devkit'

import { uploadExecutor } from './upload.impl'

export default convertNxExecutor(uploadExecutor)
