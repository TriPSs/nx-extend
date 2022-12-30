export enum Provider {
  AWS = 'aws',
  AZURE = 'azure',
  GOOGLE_CLOUD_PLATFORM = 'gcp'
}

export function getCloudTemplateName(cloudProvider: string) {
  return `${cloudProvider}-typescript`
}
