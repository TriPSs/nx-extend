import { ExecutorContext, logger } from '@nrwl/devkit'
import { buildCommand, execCommand } from '@nx-extend/core'
import { join, dirname } from 'path'
import * as fs from 'fs'

export interface BuildExecutorSchema {
  production?: boolean
}


export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const { root } = context.workspace.projects[context.projectName]

  logger.info('Building strapi app')

  const isProduction = options.production || process.env.NODE_ENV === 'production'

  const { success } = execCommand(buildCommand([
    isProduction && 'NODE_ENV=production',
    'npx strapi build'
  ]), {
    cwd: root
  })

  if (success) {
    logger.info('Strapi project build')
    logger.info('Copying files to dist folder')

    copyFolderSync(
      join(context.root, root),
      join(context.root, 'dist', root)
    )

    logger.info('Strapi build done')
  }

  return { success }
}

export function copyFolderSync(from, to) {
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(join(from, element))
    const toPath = join(to, element)

    if (stat.isFile()) {
      // Make sure the directory exists
      fs.mkdirSync(dirname(toPath), { recursive: true })

      fs.copyFileSync(join(from, element), toPath)

    } else if (stat.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(join(from, element)), toPath)

    } else if (stat.isDirectory() && element !== 'node_modules') {
      copyFolderSync(join(from, element), toPath)
    }
  })
}

export default buildExecutor
