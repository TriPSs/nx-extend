import { isCI } from './is-ci'

export const USE_VERBOSE_LOGGING = isCI() || Boolean(process.env.NX_VERBOSE_LOGGING)
