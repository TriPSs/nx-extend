import { GCP_PROJECT_NUMBER } from './index'

// Cloud Memorystore Redis Service Agent
export const saCloudMemorystoreRedisServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@cloud-redis.iam.gserviceaccount.com`

// Compute Engine Service Agent
export const saComputeEngineServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@compute-system.iam.gserviceaccount.com`

// Kubernetes Engine Service Agent
export const saKubernetesEngineServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@container-engine-robot.iam.gserviceaccount.com`

// Container Registry Service Agent
export const saContainerRegistryServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@containerregistry.iam.gserviceaccount.com`

// Firebase Rules System
export const saFirebaseRulesSystem = `serviceAccount:service-${GCP_PROJECT_NUMBER}@firebase-rules.iam.gserviceaccount.com`

// Cloud Functions Service Agent
export const saCloudFunctionsServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcf-admin-robot.iam.gserviceaccount.com`

// App Engine Standard Environment Service Agent
export const saAppEngineStandardEnvironmentServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-gae-service.iam.gserviceaccount.com`

// Artifact Registry Service Agent
export const saArtifactRegistryServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-artifactregistry.iam.gserviceaccount.com`

// Cloud Asset Service Agent
export const saCloudAssetServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-cloudasset.iam.gserviceaccount.com`

// Cloud Build Service Agent
export const saCloudBuildServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-cloudbuild.iam.gserviceaccount.com`

// Cloud Scheduler Service Agent
export const saCloudSchedulerServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-cloudscheduler.iam.gserviceaccount.com`

// Cloud Tasks Service Agent
export const saCloudTasksServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-cloudtasks.iam.gserviceaccount.com`

// Eventarc Service Agent
export const saEventArcServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-eventarc.iam.gserviceaccount.com`

// Firebase Service Management Service Agent
export const saFirebaseServiceManagementServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-firebase.iam.gserviceaccount.com`

// Firebase Extensions API Service Agent
export const saFirebaseExtensionsAPIServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-firebasemods.iam.gserviceaccount.com`

// Firestore Service Agent
export const saFirestoreServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-firestore.iam.gserviceaccount.com`

// Monitoring Service Agent
export const saMonitoringServiceAgent = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-monitoring-notification.iam.gserviceaccount.com`

// Cloud Pub/Sub Service Account
export const saCloudPubSubServiceAccount = `serviceAccount:service-${GCP_PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com`
