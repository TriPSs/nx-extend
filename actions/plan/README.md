# plan action

**GitHub action to plan affected Nx projects**.

> This GitHub action can be used to run your NX workspace based on tags, this makes it easy to deploy
> the correct projects or completely disable ones that are not ready to be deployed yet.

## Example

```yaml
name: Check PR

# Run on all pull requests
on: [ pull_request ]

env:
  DEPENDENCIES_CACHE: cache-node-modules

permissions:
  contents: 'read'
  id-token: 'write'

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.plan.outputs.matrix }}
      hasPlan: ${{ steps.plan.outputs.hasPlan }}
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      ...other setup steps

      - name: Derive appropriate SHAs for base and head for `nx affected` commands
        uses: tripss/nx-extend/actions/set-shas@improvements
        with:
          main-branch-name: master

      - name: Plan
        id: plan
        uses: tripss/nx-extend/actions/plan@improvements
        with:
          # Plan projects with the following targets          
          targets: |
            test
            build
            e2e

          # Available options
          # <target>MaxJobs     - Amount of max jobs for this target
          # <target>Tag         - Tag the targets project needs to have (Supports conditional)
          # <target>PreTargets  - Targets of the targeted project to run before running the target
          # <target>postTargets - Targets of the targeted project to run after running the target
          # <target>Parallel    - Amount of projects it can run in parallel
            
          # Run build target when project has tag "build=enabled" AND "service" tag is not "vercel" OR has tag "service=react" 
          targetBuildTag:
            build=enabled,service!=vercel
            service=react

          testMaxJobs: 1
          testTag: |
            tests=enabled

          buildMaxJobs: 3
          buildPreTargets: |
            pull-translations

          e2eTag: |
            service=app-e2e
          e2eMaxJobs: 2

  distributed-task:
    runs-on: ubuntu-latest
    needs:
      - setup
    if: needs.setup.outputs.hasPlan == 'true'
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.setup.outputs.matrix) }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: nx affected:${{ matrix.target }}
        uses: tripss/nx-extend/actions/run-many@master
        with:
          target: ${{ matrix.target }}
          index: ${{ matrix.index }}
          count: ${{ matrix.count }}
          tag: ${{ matrix.tag }}
          parallel: ${{ matrix.parallel }}
          preTargets: ${{ matrix.preTargets }}
          postTargets: ${{ matrix.postTargets }}
```
