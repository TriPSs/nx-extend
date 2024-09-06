import { isCI } from './is-ci'

const NX_VERBOSE_LOGGING_ENABLED = process.env.NX_VERBOSE_LOGGING === 'true'

export const USE_VERBOSE_LOGGING = isCI() || NX_VERBOSE_LOGGING_ENABLED

export const USE_VERBOSE_LOGGING_MINIMAL = NX_VERBOSE_LOGGING_ENABLED || Boolean(process.env.ACTIONS_RUNNER_DEBUG)
