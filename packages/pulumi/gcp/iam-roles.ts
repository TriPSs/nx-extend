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
    // Provides read-only access to Storage objects and list them
    objectViewer: 'roles/storage.objectViewer',
    objectCreator: 'roles/storage.objectCreator',
    // Provides read/write access to Storage buckets
    bucketAdmin: 'roles/storage.bucketAdmin',
    // Provides specific permissions to Storage bucket metadata
    bucketMetadataAdmin: 'roles/storage.bucketMetadataAdmin',
    // Provides legacy role for read-only access to Storage objects
    legacyObjectReader: 'roles/storage.legacyObjectReader',
    // Provides legacy role for managing objects
    legacyObjectOwner: 'roles/storage.legacyObjectOwner',
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
    backupRuns: {
      create: 'cloudsql.backupRuns.create',
      delete: 'cloudsql.backupRuns.delete',
      get: 'cloudsql.backupRuns.get',
      list: 'cloudsql.backupRuns.list',
      update: 'cloudsql.backupRuns.update'
    },
    databases: {
      create: 'cloudsql.databases.create',
      delete: 'cloudsql.databases.delete',
      get: 'cloudsql.databases.get',
      list: 'cloudsql.databases.list',
      update: 'cloudsql.databases.update',
      getIamPolicy: 'cloudsql.databases.getIamPolicy',
      setIamPolicy: 'cloudsql.databases.setIamPolicy'
    },
    instances: {
      create: 'cloudsql.instances.create',
      delete: 'cloudsql.instances.delete',
      get: 'cloudsql.instances.get',
      list: 'cloudsql.instances.list',
      update: 'cloudsql.instances.update',
      getIamPolicy: 'cloudsql.instances.getIamPolicy',
      setIamPolicy: 'cloudsql.instances.setIamPolicy'
    }
  },
  pubSub: {
    subscriptions: {
      consume: 'pubsub.subscriptions.consume',
      create: 'pubsub.subscriptions.create',
      delete: 'pubsub.subscriptions.delete',
      get: 'pubsub.subscriptions.get',
      list: 'pubsub.subscriptions.list',
      update: 'pubsub.subscriptions.update',
      getIamPolicy: 'pubsub.subscriptions.getIamPolicy',
      setIamPolicy: 'pubsub.subscriptions.setIamPolicy'
    },
    topics: {
      attachSubscription: 'pubsub.topics.attachSubscription',
      create: 'pubsub.topics.create',
      delete: 'pubsub.topics.delete',
      get: 'pubsub.topics.get',
      list: 'pubsub.topics.list',
      publish: 'pubsub.topics.publish',
      update: 'pubsub.topics.update',
      getIamPolicy: 'pubsub.topics.getIamPolicy',
      setIamPolicy: 'pubsub.topics.setIamPolicy'
    }
  },
  storage: {
    buckets: {
      create: 'storage.buckets.create',
      delete: 'storage.buckets.delete',
      get: 'storage.buckets.get',
      list: 'storage.buckets.list',
      update: 'storage.buckets.update',
      getIamPolicy: 'storage.buckets.getIamPolicy',
      setIamPolicy: 'storage.buckets.setIamPolicy'
    },
    objects: {
      create: 'storage.objects.create',
      delete: 'storage.objects.delete',
      get: 'storage.objects.get',
      list: 'storage.objects.list',
      update: 'storage.objects.update',
      getIamPolicy: 'storage.objects.getIamPolicy',
      setIamPolicy: 'storage.objects.setIamPolicy'
    }
  },
  bigQuery: {
    datasets: {
      create: 'bigquery.datasets.create',
      delete: 'bigquery.datasets.delete',
      get: 'bigquery.datasets.get',
      list: 'bigquery.datasets.list',
      update: 'bigquery.datasets.update',
      getIamPolicy: 'bigquery.datasets.getIamPolicy',
      setIamPolicy: 'bigquery.datasets.setIamPolicy'
    },
    jobs: {
      create: 'bigquery.jobs.create',
      get: 'bigquery.jobs.get',
      list: 'bigquery.jobs.list',
      cancel: 'bigquery.jobs.cancel'
    },
    tables: {
      create: 'bigquery.tables.create',
      delete: 'bigquery.tables.delete',
      export: 'bigquery.tables.export',
      get: 'bigquery.tables.get',
      list: 'bigquery.tables.list',
      update: 'bigquery.tables.update',
      getIamPolicy: 'bigquery.tables.getIamPolicy',
      setIamPolicy: 'bigquery.tables.setIamPolicy'
    }
  },
  computeEngine: {
    instances: {
      start: 'compute.instances.start',
      stop: 'compute.instances.stop',
      create: 'compute.instances.create',
      delete: 'compute.instances.delete',
      get: 'compute.instances.get',
      list: 'compute.instances.list',
      update: 'compute.instances.update',
      getIamPolicy: 'compute.instances.getIamPolicy',
      setIamPolicy: 'compute.instances.setIamPolicy'
    },
    images: {
      create: 'compute.images.create',
      delete: 'compute.images.delete',
      get: 'compute.images.get',
      list: 'compute.images.list',
      update: 'compute.images.update'
    },
    disks: {
      create: 'compute.disks.create',
      delete: 'compute.disks.delete',
      get: 'compute.disks.get',
      list: 'compute.disks.list',
      update: 'compute.disks.update',
      getIamPolicy: 'compute.disks.getIamPolicy',
      setIamPolicy: 'compute.disks.setIamPolicy'
    }
  },
  functions: {
    functions: {
      create: 'cloudfunctions.functions.create',
      delete: 'cloudfunctions.functions.delete',
      get: 'cloudfunctions.functions.get',
      list: 'cloudfunctions.functions.list',
      update: 'cloudfunctions.functions.update',
      getIamPolicy: 'cloudfunctions.functions.getIamPolicy',
      setIamPolicy: 'cloudfunctions.functions.setIamPolicy'
    },
    operations: {
      get: 'cloudfunctions.operations.get',
      list: 'cloudfunctions.operations.list'
    }
  },
  iam: {
    roles: {
      create: 'iam.roles.create',
      delete: 'iam.roles.delete',
      get: 'iam.roles.get',
      list: 'iam.roles.list',
      update: 'iam.roles.update'
    },
    serviceAccountKeys: {
      create: 'iam.serviceAccountKeys.create',
      delete: 'iam.serviceAccountKeys.delete',
      get: 'iam.serviceAccountKeys.get'
    },
    serviceAccounts: {
      actAs: 'iam.serviceAccounts.actAs',
      create: 'iam.serviceAccounts.create',
      delete: 'iam.serviceAccounts.delete',
      disable: 'iam.serviceAccounts.disable',
      enable: 'iam.serviceAccounts.enable',
      get: 'iam.serviceAccounts.get',
      list: 'iam.serviceAccounts.list',
      signBlob: 'iam.serviceAccounts.signBlob',
      signJwt: 'iam.serviceAccounts.signJwt',
      testIamPermissions: 'iam.serviceAccounts.testIamPermissions',
      update: 'iam.serviceAccounts.update',
      getIamPolicy: 'iam.serviceAccounts.getIamPolicy',
      setIamPolicy: 'iam.serviceAccounts.setIamPolicy'
    }
  },
  cloudRun: {
    services: {
      create: 'run.services.create',
      delete: 'run.services.delete',
      get: 'run.services.get',
      list: 'run.services.list',
      update: 'run.services.update',
      getIamPolicy: 'run.services.getIamPolicy',
      setIamPolicy: 'run.services.setIamPolicy'
    },
    revisions: {
      get: 'run.revisions.get',
      list: 'run.revisions.list'
    },
    configurations: {
      get: 'run.configurations.get',
      list: 'run.configurations.list'
    }
  },
  firestore: {
    documents: {
      create: 'firestore.documents.create',
      delete: 'firestore.documents.delete',
      get: 'firestore.documents.get',
      list: 'firestore.documents.list',
      update: 'firestore.documents.update'
    },
    indexes: {
      create: 'firestore.indexes.create',
      delete: 'firestore.indexes.delete',
      get: 'firestore.indexes.get',
      list: 'firestore.indexes.list'
    }
  },
  logging: {
    logs: {
      create: 'logging.logs.create',
      delete: 'logging.logs.delete',
      list: 'logging.logs.list',
      update: 'logging.logs.update'
    },
    logEntries: {
      create: 'logging.logEntries.create',
      list: 'logging.logEntries.list'
    },
    metrics: {
      create: 'logging.metrics.create',
      delete: 'logging.metrics.delete',
      get: 'logging.metrics.get',
      list: 'logging.metrics.list',
      update: 'logging.metrics.update'
    }
  },
  monitoring: {
    alertPolicies: {
      create: 'monitoring.alertPolicies.create',
      delete: 'monitoring.alertPolicies.delete',
      get: 'monitoring.alertPolicies.get',
      list: 'monitoring.alertPolicies.list',
      update: 'monitoring.alertPolicies.update'
    },
    metricsScopes: {
      get: 'monitoring.metricsScopes.get',
      list: 'monitoring.metricsScopes.list'
    }
  }
}
