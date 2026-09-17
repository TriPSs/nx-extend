import { GCP_PROJECT_ID, iamRoles, ServiceAccountResource } from '@nx-extend/pulumi/gcp'
import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

/**
 * Creates a GitHub identity provider within a Google Cloud Platform workload identity pool, allowing specific repositories to authenticate via a service account.
 *
 * @param {string[]} repos - List of GitHub repositories that will be granted the ability to act as identities within the workload identity pool.
 * @param {function(ServiceAccountResource): void} giveSaRoles - A callback function to assign additional roles to the created service account resource.
 * @return {Output<string>} The name of the created workload identity pool provider.
 */
export function createGithubIdentityProvider(
  repos: string[],
  giveSaRoles: (sa: ServiceAccountResource) => void
): pulumi.Output<string> {
  const saGithubCi = new ServiceAccountResource(
    'github-ci',
    'Github',
    { protect: true })
    .addRole(iamRoles.iam.serviceAccountUser)
    .addRole(iamRoles.serviceusage.serviceUsageConsumer)

  giveSaRoles(saGithubCi)

  const githubPool = new gcp.iam.WorkloadIdentityPool('github-pool', {
    project: GCP_PROJECT_ID,
    displayName: 'Github Pool',
    workloadIdentityPoolId: 'github-pool'
  }, {
    protect: true
  })

  const githubPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider('github-provider', {
    project: GCP_PROJECT_ID,
    displayName: 'Github Pool',
    workloadIdentityPoolId: githubPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: 'github-provider',
    oidc: {
      issuerUri: 'https://token.actions.githubusercontent.com'
    },
    attributeMapping: {
      'google.subject': 'assertion.sub',
      'attribute.aud': 'assertion.aud',
      'attribute.actor': 'assertion.actor',
      'attribute.repository': 'assertion.repository'
    }
    // TODO:: Waiting for Google to respond??
    // attributeCondition: `assertion.repository_owner=='${githubOrganizations}'`
  }, {
    protect: true
  })

  new gcp.serviceaccount.IAMBinding('workload-identity-user', {
    serviceAccountId: saGithubCi.id,
    role: 'roles/iam.workloadIdentityUser',
    members: repos.map((repo) => (
      pulumi.interpolate`principalSet://iam.googleapis.com/${githubPool.name}/attribute.repository/${repo}`
    ))
  }, {
    protect: true
  })

  return githubPoolProvider.name
}
