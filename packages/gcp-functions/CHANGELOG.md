 
## [6.2.2](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.2.1...gcp-functions@6.2.2) (2022-06-15)


### Bug Fixes

* **gcp-functions:** Re-use `nrwl/node:webpack` when building ([7d62262](https://github.com/TriPSs/nx-extend/commit/7d62262352a87023465b961407e8b7d9a607c829))



## [6.2.1](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.2.0...gcp-functions@6.2.1) (2022-05-24)


### Bug Fixes

* **gcp-functions:** Added `nodejs16` to the schema ([7b50c33](https://github.com/TriPSs/nx-extend/commit/7b50c336d980c72cebdffb7d7dbd2806a4aaa2b4)), closes [#51](https://github.com/TriPSs/nx-extend/issues/51)
* Fix some typings after nx upgrade ([6f97c02](https://github.com/TriPSs/nx-extend/commit/6f97c029988ba9047c108a9e014c1703586a379b))



# [6.2.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.1.3...gcp-functions@6.2.0) (2022-02-06)


### Features

* **gcp-functions:** Added support for `cpu` option ([721e074](https://github.com/TriPSs/nx-extend/commit/721e0747886d7f472b62f51683d14c52a7435b34))



## [6.1.3](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.1.2...gcp-functions@6.1.3) (2022-01-30)


### Bug Fixes

* **gcp-functions:** Fixed regex that extracts deps to also works in minified code ([d88dccb](https://github.com/TriPSs/nx-extend/commit/d88dccb50c59a332d6b8e195290b1bbd01563c9b))



## [6.1.2](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.1.1...gcp-functions@6.1.2) (2022-01-29)


### Bug Fixes

* **gcp-functions:** Always run with `--quiet` ([e4cb336](https://github.com/TriPSs/nx-extend/commit/e4cb336adec7c8d1914da565e396d3b97c20b5da))



## [6.1.1](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.1.0...gcp-functions@6.1.1) (2022-01-28)


### Bug Fixes

* **gcp-functions:** Fixed issue that sql instance or secrets where not being added ([b4bc302](https://github.com/TriPSs/nx-extend/commit/b4bc302f7c8f18df0c8de9e8949d0462f39e9a63))



# [6.1.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.0.1...gcp-functions@6.1.0) (2022-01-25)


### Features

* **gcp-functions:** Added support for the `timeout` option ([ed1e6c3](https://github.com/TriPSs/nx-extend/commit/ed1e6c377e6b5c82d0242a95556ea379621df6dd))
* **gcp-functions:** use @nrwl/devkit to interact with file  ([4092973](https://github.com/TriPSs/nx-extend/commit/4092973a871c227c3d892a9852336dc6cb9ef860))



## [6.0.1](https://github.com/TriPSs/nx-extend/compare/gcp-functions@6.0.0...gcp-functions@6.0.1) (2021-12-21)


### Reverts

* **gcp-functions:** Disable yarn lock file again ([d9e7106](https://github.com/TriPSs/nx-extend/commit/d9e71064799ec5e7b0dd78470d98b37706b2d367))



# [6.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@5.3.0...gcp-functions@6.0.0) (2021-12-15)


* feat(translations)!: Change to latest node lts ([f11b4ed](https://github.com/TriPSs/nx-extend/commit/f11b4eddff860a689de5b8ec7e39817ed70e8401))


### Features

* **translations:** Add support for generating `yarn.lock` based on lock file in project root ([48caabd](https://github.com/TriPSs/nx-extend/commit/48caabd1d66e70c90ce099ab6368bf0550f168ee))


### BREAKING CHANGES

* Using latest node lts (16)



# [5.3.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@5.2.0...gcp-functions@5.3.0) (2021-12-01)


### Bug Fixes

* **gcp-functions:** No longer install the needed gcloud components as on usage it will be installed ([b0c3ab0](https://github.com/TriPSs/nx-extend/commit/b0c3ab073b15668a7c8f2e003f9a75cd023c9606))


### Features

* **gcp-functions:** When generating function default set `generateLockFile` to `true` ([c336094](https://github.com/TriPSs/nx-extend/commit/c336094a2eea5702247fa5437f0a79b89af5fb64))



# [5.2.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@5.1.0...gcp-functions@5.2.0) (2021-11-30)


### Features

* **gcp-functions:** Build now uses `options.outputFileName` ([63fe018](https://github.com/TriPSs/nx-extend/commit/63fe0186393f61c229580d33c2abdb83eb3dbf67))



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@5.0.0...gcp-functions@5.1.0) (2021-11-30)


### Bug Fixes

* **gcp-functions:** Fixed alpha/beta components not being installed quietly ([09b2f84](https://github.com/TriPSs/nx-extend/commit/09b2f84eef2df8c6a7e28ad98b5b951fb9997a8a))


### Features

* **gcp-functions:** Added option to generate package json lock file ([075c88f](https://github.com/TriPSs/nx-extend/commit/075c88f6aa67c71937ef416bf11bbc309865cce8))



# [5.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@4.1.1...gcp-functions@5.0.0) (2021-11-16)


### Bug Fixes

* **gcp-functions:** Allow unauthenticated default false for not http triggers ([95f9ee4](https://github.com/TriPSs/nx-extend/commit/95f9ee47a3e2bc13d5106ceefdee672f04e0d178))


* fix(gcp-functions)!: Only allow unauthenticated calls when trigger is http ([9c4f1a8](https://github.com/TriPSs/nx-extend/commit/9c4f1a8c97e3e8482da927fe49086c60247a11ef))
* fix(gcp-functions)!: Change default behavior of ingress settings for pub/sub events ([26c2c64](https://github.com/TriPSs/nx-extend/commit/26c2c64d8be641f5d419237275345b071fd4aa6e))


### Features

* **gcp-functions:** Added `cloudSqlInstance` option for gen 2 ([51b249c](https://github.com/TriPSs/nx-extend/commit/51b249c5c8a92c811ceddc931c0e933a56f9dc67))


### BREAKING CHANGES

* **gcp-functions:** Default behavior of `allowUnauthenticated` changed
* `allowUnauthenticated` is now ignored if trigger is not http
* When deploying an `trigger !== http` the default setting for ingress will now bwe `internal-only`



## [4.1.1](https://github.com/TriPSs/nx-extend/compare/gcp-functions@4.1.0...gcp-functions@4.1.1) (2021-11-09)


### Bug Fixes

* **gcp-functions:** Always use the `gcloudCommand` variable ([a94020c](https://github.com/TriPSs/nx-extend/commit/a94020c1ce395f1e30f426f57e7cdd09a0822890))



# [4.1.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@4.0.1...gcp-functions@4.1.0) (2021-11-09)


### Bug Fixes

* **gcp-functions:** Fixes for paths an init generator ([1a2e785](https://github.com/TriPSs/nx-extend/commit/1a2e785c71a936930cfa87b559aad4ca1e74fbcc))


### Features

* **gcp-functions:** Added `--secrets` option and gen2 support ([02beb56](https://github.com/TriPSs/nx-extend/commit/02beb56720304dfde8b20a60ddeed2d7d553d0d4))



## [4.0.1](https://github.com/TriPSs/nx-extend/compare/gcp-functions@4.0.0...gcp-functions@4.0.1) (2021-11-04)


### Bug Fixes

* Always return promise ([43f4293](https://github.com/TriPSs/nx-extend/commit/43f42935887efd612da2661e6d4f640d900814eb))
* **gcp-functions:** Fixes in templated files ([0f51d80](https://github.com/TriPSs/nx-extend/commit/0f51d80dcf6624e504caa3aaf39cf9a4197c4d98))



# [4.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@3.0.0...gcp-functions@4.0.0) (2021-10-28)


### Bug Fixes

* Fixes in build ([eb1b9f1](https://github.com/TriPSs/nx-extend/commit/eb1b9f11fce7565db4c62ab760ba096878df0383))
* **gcp-functions:** Fixed build for NX 13 ([119c3a3](https://github.com/TriPSs/nx-extend/commit/119c3a35057c8a137e16a9d8c1a6365d5b230bab))


* feat!: Upgrade to NX 13 and remove angular `@angular-devkit` dependency ([0a6b125](https://github.com/TriPSs/nx-extend/commit/0a6b125d87431c5eecafebbdda7b12ed5fc6ab2b))


### Features

* **gcp-functions:** Added documentation and improve implementation ([961ab97](https://github.com/TriPSs/nx-extend/commit/961ab970ac996875d2e50ca6e82f9eadd46948d6))


### BREAKING CHANGES

* Removed `@angular-devkit` dependency and executors / generators implementations are updated.



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-functions@2.1.3...gcp-functions@3.0.0) (2021-10-08)

### Bug Fixes

* Redeploy all apps ([42cc94f](https://github.com/TriPSs/nx-extend/commit/42cc94f1d8867ba33ee5be325f6c24343f299d74))
* **gcp-functions:** Fixed that source path was incorrect for generated
  functions ([4c37217](https://github.com/TriPSs/nx-extend/commit/4c372178a154f769ff748eedbd4330bbf3117eed))
* Removed $id and $schema from
  schema.json ([c971396](https://github.com/TriPSs/nx-extend/commit/c9713967fae9d15f5351c4432a7f761361de5d55))
* **gcp-functions:** Fixed that some deps where incorrect in
  package.json ([6a32def](https://github.com/TriPSs/nx-extend/commit/6a32def6e270048f8f734d96ce298b1f6c124e9c))
* **gcp-functions:** Log when dep could not be added to created
  package.json ([1ac0c33](https://github.com/TriPSs/nx-extend/commit/1ac0c33fbd24a4a072451c5d652220939ac70e9c))
* **gcp-functions:** Small
  fixes ([ee7091c](https://github.com/TriPSs/nx-extend/commit/ee7091cac14e73b575d84d0ddb2009420798468e))

### Features

* **firebase-hosting:** Added firebase hosting to easily deploy sites to
  firebase ([e5fc4c6](https://github.com/TriPSs/nx-extend/commit/e5fc4c662c6d48d8ceffedeaf341f9e65054762a))
* **gcp-functions:** Added deploy / build
  executors ([d4137eb](https://github.com/TriPSs/nx-extend/commit/d4137eb3a10af3c3670078d43dff8cb110fc0bea))
* **gcp-functions:** Added entryPoint and serviceAccount
  options ([bdebec0](https://github.com/TriPSs/nx-extend/commit/bdebec09015ee4f7214173aef9553b547a7469af))
* **gcp-functions:** Added improved build
  command ([7e87df7](https://github.com/TriPSs/nx-extend/commit/7e87df7aef602ba5262999d2576925e609133950))
* **gcp-functions:** Added init
  generator ([f446297](https://github.com/TriPSs/nx-extend/commit/f44629778802f3bf04b71f74c80c85050f3cc249))
* **gcp-functions:** Added init
  runner ([dde6ddb](https://github.com/TriPSs/nx-extend/commit/dde6ddb62dcc99ea3cf6bcdac3fe6fc96935875a))
* **gcp-functions:** Added more
  options ([5a97afb](https://github.com/TriPSs/nx-extend/commit/5a97afb52613ae9c412ff55e3d0da52b9254e6a9))
* **gcp-functions:** Added triggerEvent and securityLevel
  options ([ae6c292](https://github.com/TriPSs/nx-extend/commit/ae6c2922affcde11d00a5ab5b6fd007aad016b80))
* **gcp-secrets:** Finished
  encrypt/decrypt/deploy ([3e4c938](https://github.com/TriPSs/nx-extend/commit/3e4c9384bab47119824c849e932590d6b437c69f))
* Added conventional
  changelog ([d34bfc2](https://github.com/TriPSs/nx-extend/commit/d34bfc2bbe9c5c7da7d2246e26209dd27b126a49))
* Added
  gcp-deployment-manager ([378130d](https://github.com/TriPSs/nx-extend/commit/378130db249a5d3f7148e375591a2534585bc144))
* Added gcp-functions and
  gcp-storage ([1df24c9](https://github.com/TriPSs/nx-extend/commit/1df24c9b67eed68aa561c226d8f30846fabb6c38))

### BREAKING CHANGES

* **gcp-functions:** Changed default runtime from nodejs12 to nodejs14

## [2.1.3](https://github.com/TriPSs/nx-extend/compare/gcp-functions@2.1.2...gcp-functions@2.1.3) (2021-10-08)

### Bug Fixes

* Redeploy all apps ([c09ae4f](https://github.com/TriPSs/nx-extend/commit/c09ae4f2993b5e383ca7b02d3df66c93a0a64df5))
