import { convertNxExecutor } from '@nx/devkit'

import workspaceExecutor from './workspace.impl'

export default convertNxExecutor(workspaceExecutor)
