import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import * as fs from 'fs'
import * as path from 'path'

import { BuildExecutorSchema } from './schema'
import { execCommand } from '../../utils/exec'

export async function runBuilder(
  options: BuildExecutorSchema,
  context: BuilderContext
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)

  context.reportStatus('Building strapi app')

  const isProduction = options.production || process.env.NODE_ENV === 'production'

  const { success } = await execCommand(`${isProduction ? 'NODE_ENV=production' : ''} yarn strapi build`, {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`
  })

  if (success) {
    context.reportStatus('Strapi project build')
    context.reportStatus('Copying files to dist folder')

    copyFolderSync(
      `${context.workspaceRoot}/${projectMeta.root}`,
      `${context.workspaceRoot}/dist/${projectMeta.root}`
    )

    context.reportStatus('Strapi build done')
  }

  return { success: false }
}

export function copyFolderSync(from, to) {
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element))
    const toPath = path.join(to, element)

    if (stat.isFile()) {
      // Make sure the directory exists
      fs.mkdirSync(path.dirname(toPath), { recursive: true })

      fs.copyFileSync(path.join(from, element), toPath)

    } else if (stat.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(path.join(from, element)), toPath)

    } else if (stat.isDirectory() && element !== 'node_modules') {
      copyFolderSync(path.join(from, element), toPath)
    }
  })
}

export default createBuilder(runBuilder)
