 
## [3.3.1](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.3.0...gcp-secrets@3.3.1) (2022-09-29)


### Bug Fixes

* **gcp-secrets:** Fixed README and re-release ([bd04aa2](https://github.com/TriPSs/nx-extend/commit/bd04aa26e1c62f104bcd952db513d4cf843496a7))



# [3.3.0](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.6...gcp-secrets@3.3.0) (2022-09-28)


### Features

* **gcp-secrets:** Added the `secret` option to all executors to only target that secret ([83bde91](https://github.com/TriPSs/nx-extend/commit/83bde91b5d84985db92d27a30ef912060e10b6ff))



## [3.2.6](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.5...gcp-secrets@3.2.6) (2022-06-15)


### Bug Fixes

* Re-release all ([2696931](https://github.com/TriPSs/nx-extend/commit/26969318cadada2173710dac9ad1b52257c31760))



## [3.2.6](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.5...gcp-secrets@3.2.6) (2022-06-15)



## [3.2.5](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.4...gcp-secrets@3.2.5) (2022-05-24)


### Bug Fixes

* Fix some typings after nx upgrade ([6f97c02](https://github.com/TriPSs/nx-extend/commit/6f97c029988ba9047c108a9e014c1703586a379b))



## [3.2.4](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.3...gcp-secrets@3.2.4) (2022-04-25)



## [3.2.3](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.2...gcp-secrets@3.2.3) (2021-12-07)


### Bug Fixes

* **gcp-secrets:** Fixed `keysAreSecrets` not working for json secret ([1d20502](https://github.com/TriPSs/nx-extend/commit/1d20502e2730eb24c20320e4bc0db413f02b24c3))



## [3.2.2](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.1...gcp-secrets@3.2.2) (2021-12-01)


### Bug Fixes

* **gcp-secrets:** Fixed `keysAreSecrets` uploading encrypted secrets ([a117e32](https://github.com/TriPSs/nx-extend/commit/a117e328d30278287d459e303f7901327e688a7d))



## [3.2.1](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.2.0...gcp-secrets@3.2.1) (2021-12-01)


### Bug Fixes

* **gcp-secrets:** When deploying keys make sure the tmp directory exists ([fd1c7d2](https://github.com/TriPSs/nx-extend/commit/fd1c7d27cf6d5b4ea63d1ee196126680d8299724))



# [3.2.0](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.1.0...gcp-secrets@3.2.0) (2021-11-09)


### Features

* **gcp-secrets:** Added `keysAreSecrets` option to deploy each key in file as a secret ([06792f0](https://github.com/TriPSs/nx-extend/commit/06792f0df99b710be8cab531bebc602b8e9e349b))



# [3.1.0](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@3.0.0...gcp-secrets@3.1.0) (2021-11-05)


### Bug Fixes

* **gcp-secrets:** Run the add / remove service account command for each service account ([6cff7c2](https://github.com/TriPSs/nx-extend/commit/6cff7c26ef791d0d0bd8b139f70ef66f4e1970a6))


### Features

* **gcp-secrets:** You can now manage permissions of the screts ([94b611a](https://github.com/TriPSs/nx-extend/commit/94b611a4ac04d082e395a207010e02b120b1aaed))



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@2.0.3...gcp-secrets@3.0.0) (2021-10-28)


### Bug Fixes

* Fixes in build ([eb1b9f1](https://github.com/TriPSs/nx-extend/commit/eb1b9f11fce7565db4c62ab760ba096878df0383))
* **gcp-secrets:** When creating app move files into `./src` ([6db22c5](https://github.com/TriPSs/nx-extend/commit/6db22c5855314f631075e8b9c861d637e40b2a05))


* feat!: Upgrade to NX 13 and remove angular `@angular-devkit` dependency ([9bc2171](https://github.com/TriPSs/nx-extend/commit/9bc217172f16292500fa59b96f543ffd2f91ad28))


### BREAKING CHANGES

* Removed `@angular-devkit` dependency and executors / generators implementations are updated.



## [2.0.3](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@2.0.2...gcp-secrets@2.0.3) (2021-10-13)

### Bug Fixes

* **gcp-secrets:** Fixed project root instead of sourceRoot being used in deploy and
  encrypt ([22597ac](https://github.com/TriPSs/nx-extend/commit/22597acd3b614718d4edd26647bfdf57fbc15a70))

## [2.0.2](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@2.0.1...gcp-secrets@2.0.2) (2021-10-08)

### Bug Fixes

* Redeploy all apps ([c09ae4f](https://github.com/TriPSs/nx-extend/commit/c09ae4f2993b5e383ca7b02d3df66c93a0a64df5))

## [2.0.1](https://github.com/TriPSs/nx-extend/compare/gcp-secrets@2.0.0...gcp-secrets@2.0.1) (2021-10-08)
