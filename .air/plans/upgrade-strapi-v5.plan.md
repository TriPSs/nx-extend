## Goal

Upgrade `@nx-extend/strapi` from the legacy Strapi 4.26.x integration to the current stable Strapi 5.52.1 toolchain, while preserving Nx generation, build output, and a passing end-to-end workflow.

## Approach

Strapi 4 is end-of-life and its `@strapi/generate-new` package is frozen at 4.25.23; Strapi 5.52.1 is the current stable release and exposes the supported `create-strapi` scaffolding CLI. Replace the plugin’s imports of v4-private generator/admin APIs with the versioned public v5 CLI commands, keeping the Nx generator responsible for project configuration and the executor responsible for producing the existing `dist/<project>` deployment layout. Remove v4-only admin/Webpack additions and validate the generated Strapi 5 project through the existing isolated Nx e2e fixture.

## File Changes

- **Modify** `packages/strapi/package.json:18-24` — replace the legacy `@strapi/generate-new` dependency with the versioned Strapi 5 scaffolding package; raise the `@strapi/strapi` peer range to the selected 5.52.1-compatible range.
- **Modify** `yarn.lock:5497-5505` and generated package resolutions — regenerate the Yarn 4 lockfile for the new Strapi 5 dependency graph; remove the v4 generator resolution.
- **Modify** `packages/strapi/src/generators/init/init.impl.ts:1-106` — replace v4-internal `generateNew`/machine-ID imports and hard-coded 4.26.1 options with a non-interactive invocation of the pinned `create-strapi` CLI. Request a TypeScript quickstart scaffold without starting or independently installing it; retain Nx project-target creation, and remove v4-only React/router/styled-components dependency injection.
- **Modify** `packages/strapi/src/executors/build/build.impl.ts:1-84` — stop calling v4-private `@strapi/admin/cli` and `@strapi/typescript-utils` APIs. Invoke the Strapi 5 public build command in the generated project, then copy/assemble its server and admin build artifacts into the configured Nx output directory before producing the deployable package manifest and optional lockfile.
- **Modify** `packages/strapi/src/utils/create-package-json.ts:8-64` — retain generated-project runtime dependencies when composing the deployment manifest, and ensure its start script remains compatible with a Strapi 5 production build.
- **Delete** `packages/strapi/src/generators/init/files/src/admin/webpack.config.js.template` — Strapi 5’s generated admin is Vite-based, so do not add a v4 Webpack customizer to new applications.
- **Modify** `packages/strapi/src/with-nx.ts:1-59` and `packages/strapi/src/index.ts:1` — either remove the v4 Webpack-specific public helper or replace it with the equivalent v5/Vite output integration only if the public build command cannot direct its output; do not leave generated code depending on a Webpack-only hook.
- **Modify** `e2e/strapi-e2e/tests/strapi.spec.ts:13-33` — assert the generated project has Strapi 5’s expected manifest/configuration and dependency version, while retaining the full `nx build` assertion against its distributable server, configuration, and admin assets.
- **Modify** `packages/strapi/README.md:7-96` — update any Strapi-version-specific setup/build guidance and document the Strapi 5/Node compatibility expectation if the selected stable release requires it.
- **Modify** `packages/strapi/CHANGELOG.md:1` — add the release entry describing the Strapi 5 major upgrade and any public helper removal or migration note.

## Implementation Steps

### Task 1: Move the plugin to the supported Strapi 5 packages

1. In `packages/strapi/package.json:18-24`, replace `@strapi/generate-new@^4.26.1` with `create-strapi@^5.52.1`, and set the Strapi peer dependency to `^5.52.1` (or the exact compatible stable range validated by the install).
2. Run Yarn 4’s normal dependency resolution from the workspace root to update `yarn.lock`; confirm the workspace entry no longer references `@strapi/generate-new` and resolves the Strapi 5 creation package.
3. Inspect the installed 5.52.1 CLI help once to use its actual non-interactive flags, then encode a pinned local-binary invocation—not an unpinned `@latest` network call—so generated projects are reproducible.

### Task 2: Make the Nx generator produce a Strapi 5 application

1. In `packages/strapi/src/generators/init/init.impl.ts:19-47`, replace the direct v4 private-module call with the supported `create-strapi` command, passing the normalized project path/name, TypeScript, quickstart SQLite setup, no-run, no-install, and non-interactive/Cloud-skip options supported by the installed CLI.
2. Preserve `addProjectConfiguration` at `packages/strapi/src/generators/init/init.impl.ts:64-88` so the generated application still exposes `@nx-extend/strapi:serve` and `@nx-extend/strapi:build` targets.
3. Delete the obsolete Webpack template at `packages/strapi/src/generators/init/files/src/admin/webpack.config.js.template`; remove the post-generation v4 admin dependency injection at lines 95-105 because the Strapi 5 scaffold owns its admin dependency set.
4. Update/remove `packages/strapi/src/with-nx.ts:1-59` and its export in `packages/strapi/src/index.ts:1` according to the selected v5 build-output mechanism, so newly generated projects contain no Webpack configuration and existing exports do not misrepresent v5 support.

### Task 3: Port the build executor to Strapi 5’s public CLI

1. In `packages/strapi/src/executors/build/build.impl.ts:1-68`, replace the unsupported `@strapi/admin/cli` and `@strapi/typescript-utils` imports/calls with the public `strapi build` command executed from the resolved `options.root || project.root`, carrying production/minification and configured environment values.
2. Keep the executor contract at `packages/strapi/src/executors/build/build.impl.ts:31-81`: validate `outputPath`, honor a custom root, preserve configured environment values, copy the generated server/public/favicon assets and Strapi’s admin build into `dist/<project>`, and return `{ success: true }`.
3. Adjust `packages/strapi/src/utils/create-package-json.ts:16-54` so the deployable manifest includes all runtime dependencies declared by the generated Strapi 5 project, not only the Nx graph result, while retaining `strapi start` and optional lockfile generation.

### Task 4: Lock in behavior with end-to-end coverage and documentation

1. Extend `e2e/strapi-e2e/tests/strapi.spec.ts:13-18` to verify the generator writes a TypeScript Strapi 5 project and declares the selected `@strapi/strapi` major in its package manifest; this catches a successful but stale/v4 scaffold.
2. Keep and update the build assertions in `e2e/strapi-e2e/tests/strapi.spec.ts:21-32` for the actual Strapi 5 output layout, including the deployment `package.json`, compiled application/configuration, and built admin entry file.
3. Update `packages/strapi/README.md:18-96` with the supported major version, generated-project requirements, and unchanged Nx build/serve commands; add the corresponding breaking-change note to `packages/strapi/CHANGELOG.md:1`.

## Acceptance Criteria

- The plugin package declares a Strapi 5.52.1-compatible peer dependency and contains no production reference to `@strapi/generate-new`, `@strapi/admin/cli`, or the v4 Webpack template.
- `nx g @nx-extend/strapi:init test-strapi` completes non-interactively in the isolated e2e workspace and generates a TypeScript Strapi 5 project with a `test-strapi/src/index.ts` entry and Strapi 5 dependency declaration.
- The generator does not start a development server or trigger a second package-manager install while Nx is running it.
- `nx build test-strapi` succeeds and produces a runnable deployment directory containing its `package.json`, Strapi server/configuration output, public assets where generated, and the Strapi 5 admin build entry.
- The generated deployment manifest’s `start` script invokes `strapi start`, and it preserves generated-project runtime dependencies for deployment.
- `nx run strapi-e2e:e2e` passes from a clean workspace after `strapi:build`.

## Verification Steps

1. Run `yarn install --immutable` after updating the lockfile to validate reproducible dependency resolution.
2. Run `nx lint strapi` and `nx test strapi` to catch TypeScript/lint regressions in the plugin.
3. Run `nx build strapi`, then `nx run strapi-e2e:e2e`; the e2e target already depends on the packaged plugin build in `e2e/strapi-e2e/project.json:9-17`.
4. Inspect the temporary generated `test-strapi/package.json` and `dist/test-strapi/package.json` during e2e debugging to verify the Strapi 5 version, scripts, and runtime dependency preservation.
5. Manually run `nx serve test-strapi --no-build` in the e2e fixture (or equivalent local generated app) long enough to confirm the Strapi 5 CLI starts without the removed Webpack hook; stop it after the startup health message.

## Risks & Mitigations

- **Strapi 5 changed its scaffolding interface:** use the installed, version-pinned `create-strapi` CLI help and e2e generation rather than relying on removed private JavaScript imports.
- **Strapi 5’s admin build layout differs from v4:** make the executor copy the layout produced by the public CLI and update e2e assertions to that real layout instead of assuming `build/index.html` is unchanged.
- **The current Webpack output redirect is v4-specific:** remove it and use a v5-compatible output-copy strategy; this isolates Nx’s `outputPath` contract from Strapi’s bundler implementation.
- **Strapi 5.48.1+ requires Node 22+ (Node 24 recommended):** verify the CI/runtime Node version before upgrade; if it is below 22, update the project’s CI runtime in the same change or select the newest compatible Strapi 5 release explicitly.