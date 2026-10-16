# Repository guidance

## Layout and tooling

- This is a Yarn and Nx monorepo of TypeScript plugins.
- `packages/<name>` contains published `@nx-extend/<name>` plugins. Read the
  package's README and `project.json` before changing its behavior.
- `actions/<name>` contains GitHub Actions; their Nx project names are
  `actions-<name>`.
- `e2e/<name>-e2e` tests the corresponding plugin in a generated Nx workspace.
- Use the Yarn version configured in `package.json`. If `yarn` is unavailable,
  invoke the checked-in CLI with `node .yarn/releases/yarn-4.17.0.cjs`.
- Follow the root `eslint.config.mjs`. Projects inherit it; add project-specific
  configuration only when custom rules are needed. Do not restore `.eslintrc.json`.

## Making changes

- Keep changes focused on the requested behavior and preserve unrelated work.
- Put shared plugin utilities in `packages/core` when appropriate.
- Update the affected package's README when changing its public API or setup.
- Resolve executor project paths against the Nx workspace root, since callers can
  invoke Nx from a subdirectory.
- Keep generated files, temporary e2e workspaces, and build outputs out of commits
  unless the task explicitly concerns a tracked generated artifact.

## Validation

- Never generate new tests unless the user explicitly asks for them. Running
  existing tests is allowed.
- Run the relevant Nx targets for the affected project, for example
  `yarn nx lint strapi`, `yarn nx test strapi`, and `yarn nx build strapi`.
  Check `project.json` and inferred targets for availability.
- For generator or executor changes, run the corresponding e2e target when one
  exists, for example `CI=true yarn nx e2e strapi-e2e --skip-nx-cache`.
  These tests install dependencies and build generated applications.
- Test dependency-installation changes with `CI=true`; Yarn's immutable-install
  behavior differs in CI. Limit exceptions to newly generated test workspaces.
- Report the checks run and any remaining failures or limitations.
- For a commit/push-only request, inspect and commit the existing changes without
  rerunning validation unless the user requests it.

## Commits and pushing

- Use Conventional Commits. Package changes require a scope:
  `type(package-name): Imperative subject`.
- Use the affected package's name without the `@nx-extend/` prefix. For example,
  changes under `packages/pulumi` require `feat(pulumi): ...` or
  `fix(pulumi): ...`; never omit the scope.
- Tests and documentation use the package they concern, so changes under
  `e2e/strapi-e2e` use `test(strapi): ...`.
- Action changes use their package or Nx project name, such as
  `fix(actions-run-many): ...` or `fix(actions-set-shas): ...`.
- Repository-wide tooling, shared CI configuration, and root documentation do not
  require a scope: `chore: ...` or `docs: ...`.
- Split independent package changes into separate commits. For an inseparable
  change spanning packages, list the affected scopes separated by commas, such
  as `fix(core,strapi): ...`.
- Use a lowercase type and start the subject with an uppercase imperative verb.
  Follow the allowed types and scopes in `.commitlintrc.js`.
- Stage explicit files or hunks, inspect the staged diff, and preserve unrelated
  edits. Do not amend existing commits unless requested.
- Push only when requested; use a normal push to the current branch and do not
  force-push without explicit authorization.
