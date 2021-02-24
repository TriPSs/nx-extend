import { resolve } from 'path'
import { BuilderContext, createBuilder } from '@angular-devkit/architect'
import { normalize, workspaces } from '@angular-devkit/core'
import { BuildResult, runWebpack } from '@angular-devkit/build-webpack'
import { from, Observable } from 'rxjs'
import { concatMap, map, tap } from 'rxjs/operators'
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph'
import { generatePackageJson } from '@nrwl/node/src/utils/generate-package-json'
import { normalizeBuildOptions } from '@nrwl/node/src/utils/normalize'
import { getNodeWebpackConfig } from '@nrwl/node/src/utils/node.config'
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  createTmpTsConfig
} from '@nrwl/workspace/src/utils/buildable-libs-utils'
import { OUT_FILENAME } from '@nrwl/node/src/utils/config'
import { NxScopedHost } from '@nrwl/tao/src/commands/ngcli-adapter'

import { BuildExecutorSchema } from './schema'

export type NodeBuildEvent = BuildResult & {
  outfile: string;
}

export default createBuilder(run)

function run(options: BuildExecutorSchema, context: BuilderContext): Observable<NodeBuildEvent> {
  const projGraph = createProjectGraph()

  if (!options.buildLibsFromSource) {
    const { target, dependencies } = calculateProjectDependencies(
      projGraph,
      context
    )

    options.tsConfig = createTmpTsConfig(
      options.tsConfig,
      context.workspaceRoot,
      target.data.root,
      dependencies
    )

    if (!checkDependentProjectsHaveBeenBuilt(context, dependencies)) {
      return { success: false } as any
    }
  }

  return from(getRoots(context))
    .pipe(
      map(({ sourceRoot, projectRoot }) =>
        normalizeBuildOptions(
          options,
          context.workspaceRoot,
          sourceRoot,
          projectRoot
        )
      ),
      tap((normalizedOptions) => {
        generatePackageJson(
          context.target.project,
          projGraph,
          normalizedOptions
        )
      }),
      map(options => {
        let config = getNodeWebpackConfig(options)

        if (options.webpackConfig) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          config = require(options.webpackConfig)(config, {
            options,
            configuration: context.target.configuration
          })
        }

        return config
      }),
      concatMap(config => runWebpack(config, context, {
        logging: (stats) => {
          context.logger.info(stats.toString(config.stats))
        },
        webpackFactory: require('webpack')
      })),
      map((buildEvent: BuildResult) => {
        buildEvent.outfile = resolve(
          context.workspaceRoot,
          options.outputPath,
          OUT_FILENAME
        )
        return buildEvent as NodeBuildEvent
      })
    )
}

async function getRoots(
  context: BuilderContext
): Promise<{ sourceRoot: string; projectRoot: string }> {
  const workspaceHost = workspaces.createWorkspaceHost(
    new NxScopedHost(normalize(context.workspaceRoot))
  )

  const { workspace } = await workspaces.readWorkspace('', workspaceHost)
  const { project } = context.target
  const { sourceRoot, root } = workspace.projects.get(project)

  if (sourceRoot && root) {
    return { sourceRoot, projectRoot: root }
  }

  context.reportStatus('Error')
  const message = `${project} does not have a sourceRoot or root. Please define both.`
  context.logger.error(message)
  throw new Error(message)
}
