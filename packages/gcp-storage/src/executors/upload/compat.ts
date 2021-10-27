import { convertNxExecutor } from '@nrwl/devkit'

import { uploadExecutor } from './upload.impl'

export default convertNxExecutor(uploadExecutor)
