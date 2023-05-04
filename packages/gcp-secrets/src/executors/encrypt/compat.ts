import { convertNxExecutor } from '@nx/devkit'

import { encryptExecutor } from './encrypt.impl'

export default convertNxExecutor(encryptExecutor)
