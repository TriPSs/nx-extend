import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { FsTree } from 'nx/src/generators/tree'
import { getProjects } from 'nx/src/generators/utils/project-configuration'
import { workspaceRoot } from 'nx/src/utils/app-root'

import type { HttpFunction } from '@google-cloud/functions-framework'
import type { DeployExecutorSchema } from '@nx-extend/gcp-functions/src/executors/deploy/deploy.impl'

import { createRunnerModule } from './__runner.module'

export type NxEndpoint = {
  endpoint: string
  func: HttpFunction
} & Pick<DeployExecutorSchema, 'trigger'>

export type RunnerFunctionsMap = Map<string, Promise<any>>
export type NxEndpoints = NxEndpoint[]

export interface RunnerOptions {
  port?: number
}

export async function bootstrapRunner(basicFunctionsMap: RunnerFunctionsMap, options: RunnerOptions = {}) {
  const nxTree = new FsTree(workspaceRoot, false)
  const projects = getProjects(nxTree)

  const nxEndpoints = [] as NxEndpoint[]
  for (const [projectName, module] of basicFunctionsMap) {
    const project = projects.get(projectName)

    if (!project || project?.targets?.['deploy']?.executor !== '@nx-extend/gcp-functions:deploy' || !project?.targets?.['deploy']?.options) {
      continue
    }

    const options: DeployExecutorSchema = project.targets['deploy'].options

    nxEndpoints.push({
      endpoint: `/${options.functionName || projectName}`,
      trigger: options.trigger || 'http',
      func: (await module)[options.entryPoint] as HttpFunction
    })
  }

  const app = await NestFactory.create(createRunnerModule(nxEndpoints), new ExpressAdapter(), {
    rawBody: true
  })

  await app.listen(options.port || 8080, '0.0.0.0').then(() => {
    Logger.log('Functions running on http://localhost:8080')
  })
}
