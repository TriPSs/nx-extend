import { isCI } from './is-ci'

export const USE_VERBOSE_LOGGING = isCI() || Boolean(process.env.NX_VERBOSE_LOGGING)

export const USE_VERBOSE_LOGGING_MINIMAL = Boolean(process.env.NX_VERBOSE_LOGGING || process.env. ACTIONS_RUNNER_DEBUG)
