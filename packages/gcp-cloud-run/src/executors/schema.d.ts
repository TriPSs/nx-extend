export interface ExecutorSchema {
  name?: string
  buildTarget?: string
  dockerFile: string
  project: string
  tag?: string
  http2?: boolean
  region: string
  allowUnauthenticated?: boolean
  envVars?: {
    [key: string]: string
  }
  secrets?: string[]
  concurrency?: number
  maxInstances?: number
  minInstances?: number
  memory?: string
  cloudSqlInstance?: string
  logsDir?: string
  serviceAccount?: string
  tagWithVersion?: string
  revisionSuffix?: string
  buildWith?: 'artifact-registry'
  autoCreateArtifactsRepo?: boolean
  noTraffic?: boolean
  generateRepoInfoFile?: boolean
  timeout?: number
  cpu?: number
  cpuBoost?: boolean
}
