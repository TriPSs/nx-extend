import { logger, parseTargetString } from '@nx/devkit'
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
}

export class NxTarget {
  private _isAvailable: () => Promise<boolean>
  private _killProcess?: () => Promise<void>
  private _processExitedPromise!: Promise<any>
  private _options: NxTargetOptions

  private killed = false

  constructor(options: NxTargetOptions) {
    this._options = options

    this._isAvailable = () =>
      isApiLive(options.checkUrl, {
        rejectUnauthorized: options.rejectUnauthorized
      })
  }

  public async setup() {
    try {
      await this._startProcess()
      await this._waitForProcess()
    } catch (error) {
      await this.teardown()
      throw error
    }
  }

  public async teardown() {
    logger.info(`Stopping target "${this._options.target}"`)
    await this._killProcess?.()

    this.killed = true
  }

  private async _startProcess(): Promise<void> {
    let processExitedReject = (error: Error) => {}

    this._processExitedPromise = new Promise(
      (_, reject) => (processExitedReject = reject)
    )

    const isAlreadyAvailable = await this._isAvailable()

    if (isAlreadyAvailable) {
      if (this._options.reuseExistingServer) {
        logger.info(
          `Reusing existing server for target "${this._options.target}"`
        )
        return
      }

      throw new Error(
        `${this._options.checkUrl} is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true.`
      )
    }

    logger.info(`Starting target "${this._options.target}"`)

    this._killProcess = await launchProcess(this._options.target, {
      onExit: (code) =>
        processExitedReject(
          new Error(
            `Target "${this._options.target}" was not able to start. Exit code: ${code}`
          )
        ),
      env: this._options.env
    })

    if (this.killed) {
      await this._killProcess()
    }
  }

  private async _waitForProcess() {
    await this._waitForAvailability()
    logger.info(`Target "${this._options.target}" is live`)
  }

  private async _waitForAvailability() {
    const cancellationToken = { canceled: this.killed }

    const error = await Promise.race([
      waitFor(this._options, this._isAvailable, cancellationToken),
      this._processExitedPromise
    ])

    cancellationToken.canceled = true

    if (error) {
      throw new Error(
        `Error waiting for target "${this._options.target}" to start.`
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

  // spawnedProcess.stdout.on('data', (a) => {
  //   console.log('message', a.toString())
  // })

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
