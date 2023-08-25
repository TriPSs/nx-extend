import { loadConfig, register } from 'tsconfig-paths'

const config = loadConfig('.')
if (config.resultType === 'failed') {
  console.log('Could not load tsconfig to map paths, aborting.')
  process.exit(1)
}

register({
  baseUrl: config.absoluteBaseUrl,
  paths: config.paths
})

import './pulumi'
export * from './pulumi'
