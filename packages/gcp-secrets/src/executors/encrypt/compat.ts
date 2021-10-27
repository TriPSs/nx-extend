import { convertNxExecutor } from '@nrwl/devkit'

import { encryptExecutor } from './encrypt.impl'

export default convertNxExecutor(encryptExecutor)
