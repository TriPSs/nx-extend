import { logger, parseTargetString } from '@nrwl/devkit'
import * as childProcess from 'child_process'

import { isApiLive } from './is-api-live'
import { wait } from './wait'

export interface NxTargetOptions {
  target: string
  checkUrl?: string
  checkMaxTries?: number

  reuseExistingServer?: boolean
}

export class NxTarget {

  private _isAvailable: () => Promise<boolean>
  private _killProcess?: () => Promise<void>
  private _processExitedPromise!: Promise<any>
  private _options: NxTargetOptions

  constructor(options: NxTargetOptions) {
    this._options = options

    this._isAvailable = () => isApiLive(options.checkUrl)
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
    await this._killProcess?.()
  }

  private async _startProcess(): Promise<void> {
    let processExitedReject = (error: Error) => {
    }

    this._processExitedPromise = new Promise((_, reject) => processExitedReject = reject)

    const isAlreadyAvailable = await this._isAvailable()

    if (isAlreadyAvailable) {
      if (this._options.reuseExistingServer) {
        return
      }

      throw new Error(`${this._options.checkUrl} is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true.`)
    }

    logger.debug(`Starting target "${this._options.target}"`)

    this._killProcess = await launchProcess(this._options.target, {
      onExit: (code) => processExitedReject(new Error(`Target "${this._options.target}" was not able to start. Exit code: ${code}`))
    })
  }

  private async _waitForProcess() {
    await this._waitForAvailability()
    logger.info(`Target "${this._options.target}" is live`)
  }

  private async _waitForAvailability() {
    const cancellationToken = { canceled: false }

    const error = (await Promise.race([
      waitFor(this._options, this._isAvailable, cancellationToken),
      this._processExitedPromise
    ]))

    cancellationToken.canceled = true

    if (error) {
      throw new Error(`Error waiting for target "${this._options.target}" to start.`)
    }
  }
}

async function waitFor(options: NxTargetOptions, waitFn: () => Promise<boolean>, cancellationToken: { canceled: boolean }) {
  let serverIsLive = false
  let waitTries = 0

  while (!serverIsLive && !cancellationToken.canceled) {
    logger.info(`Target "${options.target}" is not live yet, waiting...`)

    await wait(2)
    waitTries++

    if (waitTries >= (options.checkMaxTries || 15)) {
      break
    }

    serverIsLive = await waitFn()
  }
}

function launchProcess(targetString: string, options: {
  onExit: (exitCode: number | null, signal: string | null) => void
}): () => Promise<void> {
  const { project, target, configuration } = parseTargetString(targetString)

  const spawnedProcess = childProcess.spawn(
    `npx nx ${target} ${project} ${configuration ? `--configuration=${configuration}` : ''}`,
    [],
    {
      stdio: 'inherit',
      detached: true,
      shell: true,
      cwd: process.cwd()
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
