import { BuilderContext } from '@angular-devkit/architect'

import type { BaseConfigFile } from '../utils/config-file'
import BaseProvider from './base.provider'
import TraduoraProvider, { TraduoraConfig } from './traduora.provider'
import TransifexProvider, { TransifexConfig } from './transifex.provider'
import PoeditorProvider, { PoeditorConfig } from './poeditor.provider'

export const getProvider = async (provider: string, context: BuilderContext, configFile: BaseConfigFile): Promise<BaseProvider<any>> => {
  switch (provider) {
    case 'traduora':
      return new TraduoraProvider(context, configFile as TraduoraConfig)

    case 'transifex':
      return new TransifexProvider(context, configFile as TransifexConfig)

    case 'poeditor':
      return new PoeditorProvider(context, configFile as PoeditorConfig)

    default:
      context.logger.warn(`"${provider}" is not an valid provider!`)

      return null
  }
}
