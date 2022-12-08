// import * as github from '@actions/github'
// import { existsSync, readFileSync, writeFileSync } from 'fs'
//
// import { isGithubCi } from './is-github-ci'

export const enrichVercelEnvFile = (envFile: string) => {
  // if (existsSync(envFile) && isGithubCi) {
  //   const file = readFileSync(envFile).toString('utf-8')
  //
  //   const commitMessage = `git rev-list --format=%B --max-count=1 ${github.context.sha} | tail +2`
  //
  //   writeFileSync(
  //     envFile,
  //     file
  //       .replace('VERCEL_GIT_COMMIT_SHA=""', `VERCEL_GIT_COMMIT_SHA="${github.context.sha}"`)
  //       // .replace('VERCEL_GIT_COMMIT_MESSAGE=""', `VERCEL_GIT_COMMIT_MESSAGE="${github.context.}"`)
  //       .replace('VERCEL_GIT_COMMIT_AUTHOR_NAME=""', `VERCEL_GIT_COMMIT_AUTHOR_NAME="${github.context.actor}"`)
  //       .replace('VERCEL_GIT_REPO_SLUG=""', `VERCEL_GIT_REPO_SLUG="${github.context.repo.repo}"`)
  //       .replace('VERCEL_GIT_REPO_OWNER=""', `VERCEL_GIT_REPO_OWNER="${github.context.repo.owner}"`)
  //   )
  // }
}