import {
  CreateDependencies,
  logger,
  RawProjectGraphDependency,
  workspaceRoot
} from '@nx/devkit'
import * as hcl2JsonParser from 'hcl2-json-parser'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { DependencyType } from 'nx/src/config/project-graph'

const isLocalPath = (path: string) => {
  return path.startsWith('./') || path.startsWith('../')
}

export const createDependencies: CreateDependencies = async (_, ctx) => {
  const results: RawProjectGraphDependency[] = []

  const projectRootsToProject: [projectRoot: string, name: string][] =
    Object.entries(ctx.projects).map(([name, project]) => [project.root, name])

  for (const project of Object.keys(ctx.projects)) {
    // find tf files to process in the project
    const tfFilesToProcess =
      ctx.filesToProcess.projectFileMap[project]?.filter((file) =>
        file.file.endsWith('.tf')
      ) ?? []

    for (const file of tfFilesToProcess) {
      const data = await fs.readFile(file.file)

      let parsed: hcl2JsonParser.HclDef

      try {
        parsed = await hcl2JsonParser.parseToObject(data.toString())
      } catch (e) {
        logger.warn(
          `Failed to parse .tf file ${file.file}. Error: ${e.message}`
        )
        continue
      }

      for (const moduleCall of Object.values(parsed.module ?? [])) {
        const depSourcePathRel = moduleCall[0]?.source

        if (!isLocalPath(depSourcePathRel)) {
          continue
        }

        const depSourceAbs = path.resolve(file.file, depSourcePathRel)

        const depSourceRelativeToWorkspace = path.relative(
          workspaceRoot,
          depSourceAbs
        )

        const targetProject = projectRootsToProject.find(([root]) =>
          depSourceRelativeToWorkspace.startsWith(root)
        )?.[1]

        if (!targetProject || targetProject === project) {
          continue
        }

        results.push({
          type: DependencyType.static,
          source: project,
          target: targetProject,
          sourceFile: file.file
        })
      }
    }
  }

  return results
}
