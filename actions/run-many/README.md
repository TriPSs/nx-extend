# run-many action

**GitHub action to run many affected Nx projects based of tags**.

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
    ...

  distributed-task:
    runs-on: ubuntu-latest
    needs: [ setup ]
    strategy:
      fail-fast: false
      matrix:
        index: [ 1, 2 ]
        target: [ 'build', 'test', 'lint' ]
    env:
      count: 2
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      ...

      - name: nx affected:${{ matrix.target }}
        uses: tripss/nx-extend/actions/run-many@github-actions
        with:
          target: ${{ matrix.target }}
          index: ${{ matrix.index }}
          count: ${{ env.count }}


```