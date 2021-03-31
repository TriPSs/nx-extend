import { BuilderContext } from '@angular-devkit/architect'
import BaseProvider from './base.provider'
import TraduoraProvider from './traduora.provider'
import TransifexProvider from './transifex.provider'

export { default as BaseProvider } from './base.provider'

export const getProvider = async (provider: string, context: BuilderContext): Promise<BaseProvider<any>> => {
  let providerClass
  if (provider === 'traduora') {
    context.logger.info(`Using "${provider}" provider`)

    providerClass = new TraduoraProvider(context)

  } else if (provider === 'transifex') {
    context.logger.info(`Using "${provider}" provider`)

    providerClass = new TransifexProvider(context)
  }

  if (providerClass) {
    await providerClass.init()

    return providerClass
  }

  context.logger.warn(`"${provider}" is not an valid provider!`)

  return null
}
