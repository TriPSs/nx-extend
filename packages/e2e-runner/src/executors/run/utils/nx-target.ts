import { logger, parseTargetString } from '@nx/devkit'
import * as childProcess from 'child_process'

import type { RunOptions } from '../run.impl'

import { isApiLive } from './is-api-live'
import { wait } from './wait'

export interface NxTargetOptions {
  target: string
  checkUrl?: string
  checkMaxTries?: number
  env?: { [key: string]: string }
  reuseExistingServer?: boolean
  rejectUnauthorized?: boolean
}

export class NxTarget {

  private killProcess?: () => Promise<void>
  private processExitedPromise!: Promise<any>

  private readonly isAvailable: () => Promise<boolean>
  private readonly options: NxTargetOptions
  private readonly runOptions: RunOptions

  private killed = false

  constructor(options: NxTargetOptions, runOptions: RunOptions) {
    this.options = options
    this.runOptions = runOptions

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

    this.killProcess = await launchProcess(this.options.target, {
      onExit: (code) =>
        processExitedReject(
          new Error(
            `Target "${this.options.target}" was not able to start. Exit code: ${code}`
          )
        ),
      env: this.options.env,
      verbose: this.runOptions.debug
    })

    if (this.killed) {
      await this.killProcess()
    }
  }

  private async waitForProcess() {
    await this._waitForAvailability()
    logger.info(`Target "${this.options.target}" is live`)
  }

  private async _waitForAvailability() {
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
    verbose?: boolean
  }
): () => Promise<void> {
  const { project, target, configuration } = parseTargetString(targetString)

  const spawnedProcess = childProcess.spawn(
    `npx nx ${target} ${project} ${
      configuration ? `--configuration=${configuration}` : ''
    }`,
    [],
    {
      detached: true,
      shell: true,
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...options.env
      }
    }
  )

  if (options.verbose) {
    spawnedProcess.stdout.on('data', (data) => {
      logger.info(`${targetString}: ${data.toString()}`)
    })
  }

  let processClosed = false
  spawnedProcess.once('exit', (exitCode, signal) => {
    processClosed = true
    options.onExit(exitCode, signal)

    // TODO:: If "output=on-error" log it
  })

  spawnedProcess.on('data', (line) => console.error(line.toString()))

  return async () => {
    if (spawnedProcess.pid && !spawnedProcess.killed && !processClosed) {
      spawnedProcess.removeAllListeners()

      process.kill(-spawnedProcess.pid, 'SIGKILL')
    }
  }
}
