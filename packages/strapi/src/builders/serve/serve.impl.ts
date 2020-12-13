import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import { exec } from 'child_process'

import { BuildExecutorSchema } from './schema'

export async function runBuilder(
  options: BuildExecutorSchema,
  context: BuilderContext,
): Promise<{ success: boolean }> {
  const projectMeta = await context.getProjectMetadata(context.target.project)

  const childProcess = exec('yarn strapi develop', {
    cwd: `${context.workspaceRoot}/${projectMeta.root}`
  })

  /**
   * Ensure the child process is killed when the parent exits
   */
  process.on('exit', () => childProcess.kill())

  return new Promise<{ success: boolean }>((res) => {
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    childProcess.stderr.on('data', (err) => {
      process.stderr.write(err)
    })

    childProcess.on('done', (code) => {
      res({ success: code === 0 })
    })

    childProcess.on('close', (code) => {
      res({ success: code === 0 })
    })
  })
}

export default createBuilder(runBuilder)
