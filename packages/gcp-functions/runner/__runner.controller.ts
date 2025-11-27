import { Controller, Delete, Get, Logger, Options, Post, Req, Res } from '@nestjs/common'

import type { NxEndpoints } from './'
import type { Request, Response } from 'express'

export function createController(gcpFunctions: NxEndpoints) {
  @Controller()
  class FunctionController {

    readonly logger = new Logger('Runner')
    readonly endpoints = gcpFunctions

    constructor() {
      for (const { endpoint, trigger } of this.endpoints) {
        this.logger.debug(`Register ${trigger} -> "${endpoint}"`)
      }
    }

    @Get('/*')
    public async get(@Req() req, @Res() res): Promise<unknown> {
      this.logger.log(`[GET] Handle "${req.path}"`)

      return this.executeFunction(req, res)
    }

    @Post('/*')
    public async post(@Req() req, @Res() res): Promise<unknown> {
      this.logger.log(`[POST] Handle "${req.path}"`)

      return this.executeFunction(req, res)
    }

    @Options('/*')
    public option(@Req() req, @Res() res): Promise<unknown> {
      this.logger.log(`[OPTIONS] Handle "${req.path}"`)

      return this.executeFunction(req, res)
    }

    @Delete('/*')
    public delete(@Req() req, @Res() res): Promise<unknown> {
      this.logger.log(`[DELETE] Handle "${req.path}"`)

      return this.executeFunction(req, res)
    }

    public async executeFunction(req: Request, res: Response): Promise<void> {
      const endpoint = this.endpoints.find(({ endpoint }) => (
        req.path.startsWith(endpoint)
      ))

      if (endpoint) {
        if (endpoint.trigger === 'http') {
          return endpoint.func(req, res)

        } else if (endpoint.trigger === 'topic') {
          return this.simulatePubSubEvent(req, res, endpoint.func)

        } else if (endpoint.trigger === 'bucket') {
          return endpoint.func(req.body, res)
        }

        this.logger.warn(`"${req.path}" unsupported trigger!`)

      } else {
        this.logger.warn(`"${req.path}" not found!`)
      }
      res
        .status(404)
        .send('Function not found!')
    }

    public async simulatePubSubEvent(req: Request, res: Response, pubSub): Promise<void> {
      if (
        req.method === 'POST'
        && req.headers['content-type'].includes('application/json')
        && Object.getPrototypeOf(req.body) === Object.prototype
      ) {
        try {
          let message = { attributes: null, data: null, timestamp: new Date() }

          if (req.body.message) {
            message = req.body.message
          }

          if (req.body.data) {
            message.data = Buffer.from(
              Object.getPrototypeOf(req.body.data) === Object.prototype
                ? JSON.stringify(req.body.data)
                : req.body.data,
              'binary'
            ).toString('base64')
          }

          const response = await pubSub(message)

          if (response) {
            res.send(response)

          } else {
            res.send('ok')
          }

        } catch (err) {
          console.error(err)

          res.status(500)
            .send(err)
        }
      }

      res.status(405)
        .send()
    }
  }

  return FunctionController
}
