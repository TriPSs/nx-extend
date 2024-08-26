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
