 
## [8.1.1](https://github.com/TriPSs/nx-extend/compare/vercel@8.1.0...vercel@8.1.1) (2024-06-25)


### Bug Fixes

* **vercel:** remove  archive option for deploy executor ([8d7929a](https://github.com/TriPSs/nx-extend/commit/8d7929ac5dc6cbd5559f546bb1085869b2c674ad))



# [8.1.0](https://github.com/TriPSs/nx-extend/compare/vercel@8.0.3...vercel@8.1.0) (2024-06-24)


### Features

* **vercel:** add archive option for deploy executor ([b2e6388](https://github.com/TriPSs/nx-extend/commit/b2e6388d141142f1a06e1d32181b0ed22a1ad128))



## [8.0.3](https://github.com/TriPSs/nx-extend/compare/vercel@8.0.2...vercel@8.0.3) (2024-06-17)

### Dependency Updates

* `core` updated to version `7.0.3`


## [8.0.2](https://github.com/TriPSs/nx-extend/compare/vercel@8.0.1...vercel@8.0.2) (2024-06-14)

### Dependency Updates

* `core` updated to version `7.0.2`

### Bug Fixes

* Re-add dep options that where supposed to be deprecated ([3854a73](https://github.com/TriPSs/nx-extend/commit/3854a73f3ba70453cf1cf7c8c82122eb17364bb8))



## [8.0.1](https://github.com/TriPSs/nx-extend/compare/vercel@8.0.0...vercel@8.0.1) (2024-06-14)

### Dependency Updates

* `core` updated to version `7.0.1`


# [8.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@7.0.0...vercel@8.0.0) (2024-05-15)

### Dependency Updates

* `core` updated to version `7.0.0`

### Features

* Updated Nx ([79325aa](https://github.com/TriPSs/nx-extend/commit/79325aa06e0251f45dbf295f6c19fc417a301fc7))


### BREAKING CHANGES

* Updated to Nx 19



# [7.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@6.0.4...vercel@7.0.0) (2024-02-08)


### Features

* Updated Nx ([db61114](https://github.com/TriPSs/nx-extend/commit/db61114abc4991ae0e66ade0660b2baee76263f0))


### BREAKING CHANGES

* Updated Nx to version 18



## [6.0.4](https://github.com/TriPSs/nx-extend/compare/vercel@6.0.3...vercel@6.0.4) (2024-01-18)


### Bug Fixes

* **vercel:** Added `remix` as framework option ([2aebc32](https://github.com/TriPSs/nx-extend/commit/2aebc32c2b44988f0a64cb51d7a7fc9d9dcc8ef6))



## [6.0.3](https://github.com/TriPSs/nx-extend/compare/vercel@6.0.2...vercel@6.0.3) (2023-12-09)



## [6.0.2](https://github.com/TriPSs/nx-extend/compare/vercel@6.0.1...vercel@6.0.2) (2023-11-21)


### Reverts

* **vercel:** Always use `npx` as this caused more issues than expected for yarn projects ([ec8f3bb](https://github.com/TriPSs/nx-extend/commit/ec8f3bb1b9f821dd96fe6a2698de00e35419b0f8))



## [6.0.1](https://github.com/TriPSs/nx-extend/compare/vercel@6.0.0...vercel@6.0.1) (2023-11-09)


### Bug Fixes

* **vercel:** Add missing vercel dep (needed when package manger is used to execute) ([e761326](https://github.com/TriPSs/nx-extend/commit/e761326b266c2ebcad5de72719f50d1bc3e362db))



# [6.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@5.1.0...vercel@6.0.0) (2023-10-31)


### Features

* Update to NX 17 ([c21accb](https://github.com/TriPSs/nx-extend/commit/c21accbed588d43cb5a53b4ce5d061722e7740f2))
* Use package manager instead of npx when running commands ([f649413](https://github.com/TriPSs/nx-extend/commit/f649413c682f493a00c59c9ee09ed1ff45df1d77))


### BREAKING CHANGES

* Updated to NX 17



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/vercel@5.0.2...vercel@5.1.0) (2023-10-04)


### Features

* **vercel:** Added `config` option to build executor ([e2721da](https://github.com/TriPSs/nx-extend/commit/e2721daa2061474b6692033d944f82da04d25881))



## [5.0.2](https://github.com/TriPSs/nx-extend/compare/vercel@5.0.1...vercel@5.0.2) (2023-08-31)



## [5.0.1](https://github.com/TriPSs/nx-extend/compare/vercel@5.0.0...vercel@5.0.1) (2023-08-25)



# [5.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@4.2.1...vercel@5.0.0) (2023-07-28)


### Features

* **vercel:** Improve `buildTarget` logic ([36b903f](https://github.com/TriPSs/nx-extend/commit/36b903f0fc41559ad516ab1a7d091b332cb714de))


### BREAKING CHANGES

* **vercel:** The logic update could break your build / deploy, add `buildTarget` option now with the project name and optional config



## [4.2.1](https://github.com/TriPSs/nx-extend/compare/vercel@4.2.0...vercel@4.2.1) (2023-07-27)



# [4.2.0](https://github.com/TriPSs/nx-extend/compare/vercel@4.1.0...vercel@4.2.0) (2023-07-22)


### Bug Fixes

* **vercel:** Fixed deployment url not being written to summary ([c7814c6](https://github.com/TriPSs/nx-extend/commit/c7814c687b856264c77b4fdd64be0ebe61ec038a))


### Features

* **vercel:** When running in Github set url as output ([138fa4e](https://github.com/TriPSs/nx-extend/commit/138fa4e7fd442ca12e7801310e1d6cb07a082685))



# [4.1.0](https://github.com/TriPSs/nx-extend/compare/vercel@4.0.0...vercel@4.1.0) (2023-06-22)


### Features

* Added `publish` target ([6f1844f](https://github.com/TriPSs/nx-extend/commit/6f1844f792b704d63fca2663363ca0f65fe6451c))



# [4.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@3.0.0...vercel@4.0.0) (2023-06-22)



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@2.0.0...vercel@3.0.0) (2023-06-22)



# [2.0.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.8.3...vercel@2.0.0) (2023-06-22)


### Features

* Updated to NX 16 ([4896bf6](https://github.com/TriPSs/nx-extend/commit/4896bf66940e1b69e0f2e3971a7864a1da20b2ef))


### BREAKING CHANGES

* Updated to NX 16



## [1.8.3](https://github.com/TriPSs/nx-extend/compare/vercel@1.8.2...vercel@1.8.3) (2023-03-30)



## [1.8.2](https://github.com/TriPSs/nx-extend/compare/vercel@1.8.1...vercel@1.8.2) (2022-12-29)


### Bug Fixes

* **vercel:** Go back and use `rmSync` again ([9d30509](https://github.com/TriPSs/nx-extend/commit/9d30509f1d6bac8058fe9cc7ae1ac9a855f950c3))



## [1.8.1](https://github.com/TriPSs/nx-extend/compare/vercel@1.8.0...vercel@1.8.1) (2022-12-29)


### Bug Fixes

* **vercel:** Go back and use `rmdirSync` again ([408e549](https://github.com/TriPSs/nx-extend/commit/408e5492ead4402d00464e5a3882beee95637828))



# [1.8.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.7.0...vercel@1.8.0) (2022-12-28)


### Bug Fixes

* **vercel:** Fixed correct output dir not being set for framework ([3a1a5fc](https://github.com/TriPSs/nx-extend/commit/3a1a5fc0ca5bd47fbab0a03af2da1f97a29dc633))
* **vercel:** Remove existing `.vercel` directory before build ([cee166c](https://github.com/TriPSs/nx-extend/commit/cee166cfcb5f9f626256ce35e9c5af2d6d27463c))


### Features

* **vercel:** Throw error if pull failed ([bac8c04](https://github.com/TriPSs/nx-extend/commit/bac8c0486f7de1367deea6e0b69a59b808a7cdce))



# [1.7.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.6.0...vercel@1.7.0) (2022-12-19)


### Bug Fixes

* **vercel:** Added support for `regions` option ([edcdbcc](https://github.com/TriPSs/nx-extend/commit/edcdbccd5add690ce7df3b7fba15ea3626dc2922))


### Features

* **vercel:** Added support for `regions` option ([e3f92da](https://github.com/TriPSs/nx-extend/commit/e3f92dad3d5af4b8d564ac06000d7f74e256468c))



# [1.6.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.5.0...vercel@1.6.0) (2022-12-08)


### Features

* **vercel:** Added support for `VERCEL_TOKEN` env variable ([8317753](https://github.com/TriPSs/nx-extend/commit/831775366d571f269a1ae2db2b2bf4aff3084ff2))



# [1.5.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.4.0...vercel@1.5.0) (2022-12-08)


### Features

* **vercel:** Added support to define different build config for target ([8d4e5b6](https://github.com/TriPSs/nx-extend/commit/8d4e5b68457d60411b45bc58eb10fe97ff92a6ff))



# [1.4.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.3.4...vercel@1.4.0) (2022-12-08)


### Features

* **vercel:** Add URL to GitHub summary ([eeb93a3](https://github.com/TriPSs/nx-extend/commit/eeb93a3de30a07ea7e3e4340b1ecd0efd63db0a8))
* **vercel:** Added support for different frameworks then NextJS ([da2550b](https://github.com/TriPSs/nx-extend/commit/da2550b186321baedf5d5a137d84d594f1313c36))



## [1.3.4](https://github.com/TriPSs/nx-extend/compare/vercel@1.3.3...vercel@1.3.4) (2022-11-17)


### Bug Fixes

* **vercel:** Also copy over `.vercelignore` ([1b391f4](https://github.com/TriPSs/nx-extend/commit/1b391f4471c2f5be8311cb344739950385832770))



## [1.3.3](https://github.com/TriPSs/nx-extend/compare/vercel@1.3.2...vercel@1.3.3) (2022-09-15)


### Bug Fixes

* **vercel:** Set `--prod` when building with prod config ([6e0133e](https://github.com/TriPSs/nx-extend/commit/6e0133e979200cf8ada9c3888efa907b29762142))



## [1.3.2](https://github.com/TriPSs/nx-extend/compare/vercel@1.3.1...vercel@1.3.2) (2022-09-15)


### Bug Fixes

* **vercel:** Fixed typo in deploy command ([ca3c552](https://github.com/TriPSs/nx-extend/commit/ca3c5529d07df6a86c808509b2b839218cf64e1f))



## [1.3.1](https://github.com/TriPSs/nx-extend/compare/vercel@1.3.0...vercel@1.3.1) (2022-09-14)



# [1.3.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.2.0...vercel@1.3.0) (2022-09-13)


### Features

* **vercel:** Added support for `envVars` option ([55e8e14](https://github.com/TriPSs/nx-extend/commit/55e8e14d2f7304a6833bc49881cfd3554a051192))



# [1.2.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.1.1...vercel@1.2.0) (2022-09-06)


### Features

* **vercel:** When deploying with `production` configuration also use that environment on Vercel ([e601cc3](https://github.com/TriPSs/nx-extend/commit/e601cc3fe136cfd9d1e82804569f43aa203cf8d1))



## [1.1.1](https://github.com/TriPSs/nx-extend/compare/vercel@1.1.0...vercel@1.1.1) (2022-09-05)


### Bug Fixes

* **vercel:** Fixed pull command overwriting the project settings ([4bdfa01](https://github.com/TriPSs/nx-extend/commit/4bdfa0147a8c95afdb2f1c89bc89445ef616c73b))



# [1.1.0](https://github.com/TriPSs/nx-extend/compare/vercel@1.0.0...vercel@1.1.0) (2022-09-05)


### Features

* **vercel:** Added pulling of environment before building ([bad51f4](https://github.com/TriPSs/nx-extend/commit/bad51f4f0f25e413827c5f623ef21ad8a0061353))
