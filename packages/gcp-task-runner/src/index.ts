import { readNxJson } from 'nx/src/config/nx-json'

import { GcpCache } from './gcp-cache'

export async function getRemoteCache() {
  const { gcs } = readNxJson() as { gcs?: { bucket: string } }
  // gcs.localMode ?? (gcs.localMode = 'read-write')
  // gcs.ciMode ?? (gcs.ciMode = 'read-write')

  if (!gcs || !gcs.bucket) {
    throw new Error('No bucket configured')
  }

  return new GcpCache(gcs.bucket)
}
