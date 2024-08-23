import * as pulumi from '@pulumi/pulumi'

export const config = new pulumi.Config('gcpR')
export const gcpConfig = new pulumi.Config('gcp')

export const GCP_PROJECT_ID = gcpConfig.require('project')
export const GCP_PROJECT_NUMBER = config.require('projectNumber')

export const GCP_DEFAULT_REGION = config.get('defaultRegion') || 'europe-west4'
export const GCP_DEFAULT_REGION_CRONS = config.get('defaultCronRegion') || 'europe-west1'
