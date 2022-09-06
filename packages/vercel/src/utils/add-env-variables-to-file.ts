import { appendFileSync, existsSync } from 'fs'

export const addEnvVariablesToFile = (envFile: string, envVars: string[]) => {
  if (existsSync(envFile)) {
    appendFileSync(envFile, envVars.join('\r\n'))
  }
}