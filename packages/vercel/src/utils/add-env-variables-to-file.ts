import { appendFileSync, existsSync, writeFileSync } from 'fs'

export const addEnvVariablesToFile = (envFile: string, envVars: string[]) => {
  if (!existsSync(envFile)) {
    writeFileSync(envFile, '')
  }

  appendFileSync(envFile, `\r\n${envVars.join('\r\n')}`)
}
