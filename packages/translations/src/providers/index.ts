import { BuilderContext } from '@angular-devkit/architect'
import BaseProvider from './base.provider'
import TraduoraProvider from './traduora.provider'

export { default as BaseProvider } from './base.provider'

export const getProvider = (provider: string, context: BuilderContext): BaseProvider => {
  if (provider === 'traduora') {
    context.logger.info(`Using "${provider}" provider`)

    return TraduoraProvider
  }

  context.logger.warn(`"${provider}" is not an valid provider!`)

  return null
}
