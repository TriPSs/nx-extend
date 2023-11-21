import { logger } from '@nx/devkit'
import { USE_VERBOSE_LOGGING } from '@nx-extend/core'
import ora from 'ora'

export function createStrapiLogger() {
  const state = { errors: 0, warning: 0 }

  return {
    get warnings() {
      return state.warning
    },

    get errors() {
      return state.errors
    },

    debug(...args: string[]) {
      if (!USE_VERBOSE_LOGGING) {
        return
      }

      logger.debug(...args.join('\n'))
    },

    info(...args: string[]) {
      if (!USE_VERBOSE_LOGGING) {
        return
      }

      logger.info(args.join('\n'))
    },

    log(...args: string[]) {
      if (!USE_VERBOSE_LOGGING) {
        return
      }

      logger.log(args.join('\n'))
    },

    warn(...args: string[]) {
      state.warning += 1

      logger.warn(args.join('\n'))
    },

    error(...args: string[]) {
      state.errors += 1

      logger.error(args.join('\n'))
    },

    spinner(text: string) {
      return ora(text)
    }
  }
}
