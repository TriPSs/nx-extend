import { Module } from '@nestjs/common'

import type { NxEndpoints } from './'

import { createController } from './__runner.controller'

export function createRunnerModule(gcpFunctions: NxEndpoints) {
  // Always add health endpoint
  gcpFunctions.push({
    endpoint: '/_check/health',
    trigger: 'http',
    func: (req, res) => res
      .status(200)
      .send()
  })

  @Module({
    imports: [],
    controllers: [
      createController(gcpFunctions)
    ],
    providers: []
  })
  class RunnerModule {
  }

  return RunnerModule
}
