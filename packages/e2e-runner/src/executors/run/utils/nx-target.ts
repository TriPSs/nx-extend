import { logger, parseTargetString, readCachedProjectGraph } from '@nx/devkit'
import { buildCommand, getPackageManagerDlxCommand, USE_VERBOSE_LOGGING } from '@nx-extend/core'
import * as childProcess from 'child_process'

import { isApiLive } from './is-api-live'
import { wait } from './wait'

export interface NxTargetOptions {
  target: string
  checkUrl?: string
  checkMaxTries?: number
  env?: { [key: string]: string }
  reuseExistingServer?: boolean
  rejectUnauthorized?: boolean
  logging?: boolean
}

export class NxTarget {

  private killProcess?: () => Promise<void>
  private processExitedPromise!: Promise<any>

  private readonly isAvailable: () => Promise<boolean>
  private readonly options: NxTargetOptions

  private killed = false

  constructor(options: NxTargetOptions) {
    this.options = this.processOptions(options)

    this.isAvailable = () => isApiLive(options.checkUrl, {
      rejectUnauthorized: options.rejectUnauthorized
    })
  }

  public async setup() {
    try {
      await this.startProcess()
      await this.waitForProcess()
    } catch (error) {
      logger.error(`Unable to start "${this.options.target}": ${error.message}`)

      await this.teardown()

      throw error
    }
  }

  public async teardown() {
    if (this.killed) {
      return
    }

    logger.info(`Stopping target "${this.options.target}"`)
    await this.killProcess?.()

    this.killed = true
  }

  private processOptions(options: NxTargetOptions): NxTargetOptions {
    if (options.checkUrl.includes('$')) {
      const variables = options.checkUrl.match(/\$[A-Z_-]+/g)

      if (variables && variables.length > 0) {
        for (const variable of variables) {
          const envVariable = variable.replace('$', '')

          if (envVariable in process.env) {
            options.checkUrl = options.checkUrl.replace(variable, process.env[envVariable])
          }
        }
      }
    }

    return options
  }

  private async startProcess(): Promise<void> {
    let processExitedReject = (error: Error) => {}

    this.processExitedPromise = new Promise(
      (_, reject) => (processExitedReject = reject)
    )

    const isAlreadyAvailable = await this.isAvailable()

    if (isAlreadyAvailable) {
      if (this.options.reuseExistingServer) {
        logger.info(`Reusing existing server for target "${this.options.target}"`)
        return
      }

      throw new Error(
        `${this.options.checkUrl} is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true.`
      )
    }

    logger.info(`Starting target "${this.options.target}"`)

    this.killProcess = launchProcess(this.options.target, {
      onExit: (code) => (
        processExitedReject(new Error(`Target "${this.options.target}" was not able to start. Exit code: ${code}`))
      ),
      env: this.options.env,
      logging: this.options.logging
    })

    if (this.killed) {
      await this.killProcess()
    }
  }

  private async waitForProcess() {
    await this.waitForAvailability()

    logger.info(`Target "${this.options.target}" is live`)
  }

  private async waitForAvailability() {
    const cancellationToken = { canceled: this.killed }

    const error = await Promise.race([
      waitFor(this.options, this.isAvailable, cancellationToken),
      this.processExitedPromise
    ])

    cancellationToken.canceled = true

    if (error) {
      throw new Error(
        `Error waiting for target "${this.options.target}" to start.`
      )
    }
  }
}

async function waitFor(
  options: NxTargetOptions,
  waitFn: () => Promise<boolean>,
  cancellationToken: { canceled: boolean }
) {
  let serverIsLive = await waitFn()
  let waitTries = 0

  while (!serverIsLive && !cancellationToken.canceled) {
    logger.debug(`Target "${options.target}" is not live yet, waiting...`)

    await wait(2)
    waitTries++

    if (waitTries >= (options.checkMaxTries || 15)) {
      break
    }

    serverIsLive = await waitFn()
  }

  return !serverIsLive
}

function launchProcess(
  targetString: string,
  options: {
    onExit: (exitCode: number | null, signal: string | null) => void
    env?: { [key: string]: string }
    logging?: boolean
  }
): () => Promise<void> {
  const { project, target, configuration } = parseTargetString(targetString, readCachedProjectGraph())

  const shouldLog = options.logging ?? USE_VERBOSE_LOGGING

  const command = buildCommand([
    process.env.NX_EXTEND_COMMAND_USE_NPX ? 'npx' : getPackageManagerDlxCommand(),
    `nx ${target} ${project}`,
    configuration && `--configuration=${configuration}`
  ])

  const spawnedProcess = childProcess.spawn(
    command,
    [],
    {
      detached: true,
      shell: true,
      cwd: process.cwd(),
      stdio: shouldLog ? 'inherit' : undefined,
      env: {
        ...process.env,
        // Make sure NODE_ENV is set to test
        NODE_ENV: 'test',
        ...options.env
      }
    }
  )

  let processClosed = false
  spawnedProcess.once('exit', (exitCode, signal) => {
    processClosed = true
    options.onExit(exitCode, signal)
  })

  return async () => {
    if (spawnedProcess.pid && !spawnedProcess.killed && !processClosed) {
      spawnedProcess.removeAllListeners()

      process.kill(-spawnedProcess.pid, 'SIGKILL')
    }
  }
}
