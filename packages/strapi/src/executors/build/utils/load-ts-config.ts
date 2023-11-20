import ts from 'typescript'

export function loadTsConfig(cwd: string, path: string) {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, path)

  if (!configPath) {
    return undefined
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, cwd)

  return {
    config: parsedConfig,
    path: configPath
  }
}
