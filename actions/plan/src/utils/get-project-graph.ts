import { mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import type { ProjectGraph } from '@nx/devkit'

import { execCommand } from './exec'

export function getProjectGraph(cwd: string, silent: boolean): ProjectGraph {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'nx-extend-graph-'))
  const graphFile = join(temporaryDirectory, 'project-graph.json')

  try {
    execCommand(`npx nx graph --file="${graphFile}"`, {
      silent,
      cwd
    })

    return JSON.parse(readFileSync(graphFile, 'utf8')).graph
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true })
  }
}
