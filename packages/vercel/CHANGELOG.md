 
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
