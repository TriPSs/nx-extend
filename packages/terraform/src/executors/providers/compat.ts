import { convertNxExecutor } from '@nx/devkit'

import providersExecutor from './providers.impl'

export default convertNxExecutor(providersExecutor)
