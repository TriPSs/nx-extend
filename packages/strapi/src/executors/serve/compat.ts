import { convertNxExecutor } from '@nrwl/devkit'

import { serveExecutor } from './serve.impl'

export default convertNxExecutor(serveExecutor)
