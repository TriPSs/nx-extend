import { convertNxExecutor } from '@nx/devkit'

import configExecutor from './config.impl'

export default convertNxExecutor(configExecutor)
