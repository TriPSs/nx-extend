export const iamRoles = {
  cloudSql: {
    // Connects to CloudSQL databases
    client: 'roles/cloudsql.client',
    // Administers CloudSQL instances
    admin: 'roles/cloudsql.admin',
    // Provides read-only access to CloudSQL instances
    viewer: 'roles/cloudsql.viewer',
    // Creates and manages CloudSQL instances
    creator: 'roles/cloudsql.instanceUser',
    // Full access to CloudSQL backups
    backupAdmin: 'roles/cloudsql.backupAdmin'
  },
  pubSub: {
    // Publishes messages to PubSub
    publisher: 'roles/pubsub.publisher',
    // Administers PubSub resources
    admin: 'roles/pubsub.admin',
    // Consumes PubSub messages
    subscriber: 'roles/pubsub.subscriber',
    // Provides read-only access to PubSub topics and subscriptions
    viewer: 'roles/pubsub.viewer',
    // Creates and manages PubSub topics
    topicAdmin: 'roles/pubsub.topicAdmin'
  },
  storage: {
    // Administers Storage resources
    admin: 'roles/storage.admin',
    // Provides read/write access to Storage objects
    objectAdmin: 'roles/storage.objectAdmin',
    // Provides read-only access to Storage objects
    objectViewer: 'roles/storage.objectViewer',
    // Provides read/write access to Storage buckets
    bucketAdmin: 'roles/storage.bucketAdmin',
    // Provides specific permissions to Storage bucket metadata
    bucketMetadataAdmin: 'roles/storage.bucketMetadataAdmin',
    // Provides legacy role for reading Storage buckets
    legacyBucketReader: 'roles/storage.legacyBucketReader',
    // Provides legacy role for writing Storage buckets
    legacyBucketWriter: 'roles/storage.legacyBucketWriter'
  },
  bigQuery: {
    // Administers BigQuery resources
    admin: 'roles/bigquery.admin',
    // Provides read/write access to BigQuery data
    dataEditor: 'roles/bigquery.dataEditor',
    // Provides read-only access to BigQuery data
    dataViewer: 'roles/bigquery.dataViewer',
    // Provides read/write access to BigQuery datasets
    datasetEditor: 'roles/bigquery.datasetEditor',
    // Provides read-only access to BigQuery datasets
    datasetViewer: 'roles/bigquery.datasetViewer',
    // General user role for BigQuery
    user: 'roles/bigquery.user',
    // Creates and manages BigQuery jobs
    jobUser: 'roles/bigquery.jobUser'
  },
  computeEngine: {
    // Administers Compute Engine resources
    admin: 'roles/compute.admin',
    // Provides read-only access to Compute Engine resources
    viewer: 'roles/compute.viewer',
    // Provides access to instance admin operations
    instanceAdmin: 'roles/compute.instanceAdmin.v1',
    // Provides access to snapshot resources
    snapshotAdmin: 'roles/compute.snapshotAdmin',
    // Provides read/write access to instance network configurations
    networkAdmin: 'roles/compute.networkAdmin',
    // Manages security aspects of Compute Engine
    securityAdmin: 'roles/compute.securityAdmin'
  },
  functions: {
    // Administers Cloud Functions
    admin: 'roles/cloudfunctions.admin',
    // Invokes deployed Cloud Functions
    invoker: 'roles/cloudfunctions.invoker',
    // Provides read-only access to Cloud Functions
    viewer: 'roles/cloudfunctions.viewer',
    // Develops and manages Cloud Functions
    developer: 'roles/cloudfunctions.developer'
  },
  iam: {
    // Administers IAM policies
    admin: 'roles/iam.admin',
    // Provides read-only access to IAM policies
    viewer: 'roles/iam.viewer',
    // Manages service accounts
    serviceAccountManager: 'roles/iam.serviceAccountAdmin',
    // Manages service account keys
    serviceAccountKeyAdmin: 'roles/iam.serviceAccountKeyAdmin',
    // Manages IAM roles
    roleAdmin: 'roles/iam.roleAdmin',
    // Reviews IAM security settings
    securityReviewer: 'roles/iam.securityReviewer',
    // Manages organization-wide roles
    organizationRoleAdmin: 'roles/iam.organizationRoleAdmin',
    // Allows workload identity to be used with Kubernetes
    workloadIdentityUser: 'roles/iam.workloadIdentityUser'
  },
  profiler: {
    // Administers Cloud Profiler resources
    admin: 'roles/cloudprofiler.admin',
    // Provides read-only access to Cloud Profiler data
    viewer: 'roles/cloudprofiler.viewer',
    // Collects profiling data
    agent: 'roles/cloudprofiler.agent'
  },
  tracer: {
    // Administers Cloud Trace resources
    admin: 'roles/cloudtrace.admin',
    // Provides read-only access to Cloud Trace data
    viewer: 'roles/cloudtrace.viewer',
    // Collects trace data
    agent: 'roles/cloudtrace.agent'
  },
  cloudRun: {
    // Administers Cloud Run services
    admin: 'roles/run.admin',
    // Invokes Cloud Run services
    invoker: 'roles/run.invoker',
    // Provides read-only access to Cloud Run services
    viewer: 'roles/run.viewer',
    // Develops and manages Cloud Run services
    developer: 'roles/run.developer'
  },
  cloudTasks: {
    // Administers Cloud Tasks resources
    admin: 'roles/cloudtasks.admin',
    // Enqueues tasks into Cloud Tasks
    enqueuer: 'roles/cloudtasks.enqueuer',
    // Provides read-only access to Cloud Tasks resources
    viewer: 'roles/cloudtasks.viewer',
    // Develops and manages Cloud Tasks resources
    developer: 'roles/cloudtasks.developer'
  },
  monitoring: {
    // Administers monitoring configurations
    admin: 'roles/monitoring.admin',
    // Edits monitoring configurations
    editor: 'roles/monitoring.editor',
    // Provides read-only access to monitoring data
    viewer: 'roles/monitoring.viewer',
    // Writes metrics to monitoring
    metricWriter: 'roles/monitoring.metricWriter'
  },
  logging: {
    // Administers logging configurations
    admin: 'roles/logging.admin',
    // Writes logging configurations
    configWriter: 'roles/logging.configWriter',
    // Writes logs
    logWriter: 'roles/logging.logWriter',
    // Reads logging data
    viewer: 'roles/logging.viewer'
  },
  networkServices: {
    // Administers network services
    admin: 'roles/networkservices.admin',
    // Provides read-only access to network services
    viewer: 'roles/networkservices.viewer',
    // Manages network service configurations
    serviceManager: 'roles/networkservices.servicemanager'
  },
  dns: {
    // Administers Cloud DNS resources
    admin: 'roles/dns.admin',
    // Edits Cloud DNS resources
    editor: 'roles/dns.editor',
    // Provides read-only access to Cloud DNS resources
    viewer: 'roles/dns.viewer'
  },
  secretManager: {
    // Administers Secret Manager resources
    admin: 'roles/secretmanager.admin',
    // Accesses secret data in Secret Manager
    secretAccessor: 'roles/secretmanager.secretAccessor',
    // Provides read-only access to Secret Manager
    viewer: 'roles/secretmanager.viewer'
  },
  spanner: {
    // Administers Cloud Spanner instances and databases
    admin: 'roles/spanner.admin',
    // Grants read/write access to Cloud Spanner databases
    databaseAdmin: 'roles/spanner.databaseAdmin',
    // Grants read-only access to Cloud Spanner databases
    databaseReader: 'roles/spanner.databaseReader',
    // Provides read-only access to Cloud Spanner instance configs
    viewer: 'roles/spanner.viewer'
  }
};

export const iamPermissions = {
  cloudSql: {
    // Backup runs permissions
    backupRunsCreate: 'cloudsql.backupRuns.create',
    backupRunsDelete: 'cloudsql.backupRuns.delete',
    backupRunsGet: 'cloudsql.backupRuns.get',
    backupRunsList: 'cloudsql.backupRuns.list',
    backupRunsUpdate: 'cloudsql.backupRuns.update',
    // Database permissions
    databasesCreate: 'cloudsql.databases.create',
    databasesDelete: 'cloudsql.databases.delete',
    databasesGet: 'cloudsql.databases.get',
    databasesList: 'cloudsql.databases.list',
    databasesUpdate: 'cloudsql.databases.update',
    // Instance permissions
    instancesCreate: 'cloudsql.instances.create',
    instancesDelete: 'cloudsql.instances.delete',
    instancesGet: 'cloudsql.instances.get',
    instancesList: 'cloudsql.instances.list',
    instancesUpdate: 'cloudsql.instances.update'
  },
  pubSub: {
    // Subscription permissions
    subscriptionsConsume: 'pubsub.subscriptions.consume',
    subscriptionsCreate: 'pubsub.subscriptions.create',
    subscriptionsDelete: 'pubsub.subscriptions.delete',
    subscriptionsGet: 'pubsub.subscriptions.get',
    subscriptionsList: 'pubsub.subscriptions.list',
    subscriptionsUpdate: 'pubsub.subscriptions.update',
    // Topic permissions
    topicsAttachSubscription: 'pubsub.topics.attachSubscription',
    topicsCreate: 'pubsub.topics.create',
    topicsDelete: 'pubsub.topics.delete',
    topicsGet: 'pubsub.topics.get',
    topicsList: 'pubsub.topics.list',
    topicsPublish: 'pubsub.topics.publish',
    topicsUpdate: 'pubsub.topics.update'
  },
  storage: {
    // Bucket permissions
    bucketsCreate: 'storage.buckets.create',
    bucketsDelete: 'storage.buckets.delete',
    bucketsGet: 'storage.buckets.get',
    bucketsList: 'storage.buckets.list',
    bucketsUpdate: 'storage.buckets.update',
    // Object permissions
    objectsCreate: 'storage.objects.create',
    objectsDelete: 'storage.objects.delete',
    objectsGet: 'storage.objects.get',
    objectsList: 'storage.objects.list',
    objectsUpdate: 'storage.objects.update'
  },
  bigQuery: {
    // Dataset permissions
    datasetsCreate: 'bigquery.datasets.create',
    datasetsDelete: 'bigquery.datasets.delete',
    datasetsGet: 'bigquery.datasets.get',
    datasetsList: 'bigquery.datasets.list',
    datasetsUpdate: 'bigquery.datasets.update',
    // Job permissions
    jobsCreate: 'bigquery.jobs.create',
    jobsGet: 'bigquery.jobs.get',
    jobsList: 'bigquery.jobs.list',
    // Table permissions
    tablesCreate: 'bigquery.tables.create',
    tablesDelete: 'bigquery.tables.delete',
    tablesExport: 'bigquery.tables.export',
    tablesGet: 'bigquery.tables.get',
    tablesList: 'bigquery.tables.list',
    tablesUpdate: 'bigquery.tables.update'
  },
  computeEngine: {
    // Instance permissions
    instancesStart: 'compute.instances.start',
    instancesStop: 'compute.instances.stop',
    instancesCreate: 'compute.instances.create',
    instancesDelete: 'compute.instances.delete',
    instancesGet: 'compute.instances.get',
    instancesList: 'compute.instances.list',
    instancesUpdate: 'compute.instances.update',
    // Image permissions
    imagesCreate: 'compute.images.create',
    imagesDelete: 'compute.images.delete',
    imagesGet: 'compute.images.get',
    imagesList: 'compute.images.list',
    imagesUpdate: 'compute.images.update'
  },
  functions: {
    // Cloud Function permissions
    functionsCreate: 'cloudfunctions.functions.create',
    functionsDelete: 'cloudfunctions.functions.delete',
    functionsGet: 'cloudfunctions.functions.get',
    functionsList: 'cloudfunctions.functions.list',
    functionsUpdate: 'cloudfunctions.functions.update',
    // Operation permissions
    functionsOperationsGet: 'cloudfunctions.operations.get',
    functionsOperationsList: 'cloudfunctions.operations.list'
  },
  iam: {
    // Role permissions
    rolesCreate: 'iam.roles.create',
    rolesDelete: 'iam.roles.delete',
    rolesGet: 'iam.roles.get',
    rolesList: 'iam.roles.list',
    rolesUpdate: 'iam.roles.update',
    // Service account key permissions
    serviceAccountKeysCreate: 'iam.serviceAccountKeys.create',
    serviceAccountKeysDelete: 'iam.serviceAccountKeys.delete',
    serviceAccountKeysGet: 'iam.serviceAccountKeys.get',
    // Service account permissions
    serviceAccountsCreate: 'iam.serviceAccounts.create',
    serviceAccountsDelete: 'iam.serviceAccounts.delete',
    serviceAccountsGet: 'iam.serviceAccounts.get',
    serviceAccountsList: 'iam.serviceAccounts.list',
    serviceAccountsUpdate: 'iam.serviceAccounts.update'
  }
}
