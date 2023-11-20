import { logger } from '@nx/devkit'
import os from 'os'
import ts from 'typescript'

export function loadTsConfig(cwd: string, path: string) {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, path)

  if (!configPath) {
    return undefined
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, cwd)

  logger.debug(`Loaded user TS config:`, os.EOL, parsedConfig)

  return {
    config: parsedConfig,
    path: configPath
  }
}
