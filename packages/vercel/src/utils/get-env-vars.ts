export const getEnvVars = (envVars: Record<string, string> = {}, escape?: boolean, isProduction?: boolean) => {
  return Object.keys(envVars).reduce((env, envVar) => {
    env.push(`${envVar}=${escape ? '"' : ''}${envVars[envVar]}${escape ? '"' : ''}`)

    return env
  }, [
    isProduction && 'NODE_ENV=production'
  ]).filter(Boolean)
}
