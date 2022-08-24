export const getEnvVars = (envVars: Record<string, string> = {}, isProduction?: boolean) => {
  return Object.keys(envVars).reduce((env, envVar) => {
    env.push(`${envVar}=${envVars[envVar]}`)

    return env
  }, [
    isProduction && 'NODE_ENV=production'
  ]).filter(Boolean)
}
