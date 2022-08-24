 
## [3.4.3](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.4.2...gcp-cloud-run@3.4.3) (2022-08-24)


### Bug Fixes

* **gcp-cloud-run:** Make sure the output path is set in the options ([34d0188](https://github.com/TriPSs/nx-extend/commit/34d0188673877c101f846529052dfdcd3aea8303))



## [3.4.2](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.4.1...gcp-cloud-run@3.4.2) (2022-06-15)


### Bug Fixes

* Re-release all ([2696931](https://github.com/TriPSs/nx-extend/commit/26969318cadada2173710dac9ad1b52257c31760))



## [3.4.2](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.4.1...gcp-cloud-run@3.4.2) (2022-06-15)



## [3.4.1](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.4.0...gcp-cloud-run@3.4.1) (2022-05-24)



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.3.1...gcp-cloud-run@3.4.0) (2022-01-25)


### Features

* **gcp-run:** Added support for the `timeout` option ([86e42bf](https://github.com/TriPSs/nx-extend/commit/86e42bf9a316b1129e05fcc47b1e952c0fb6826a))



## [3.3.1](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.3.0...gcp-cloud-run@3.3.1) (2021-12-21)


### Bug Fixes

* **gcp-cloud-run:** When deploying with secrets use `gcloud beta` ([7108961](https://github.com/TriPSs/nx-extend/commit/7108961b3048808f17dd2fcc1dd090bfa11d6b30))



# [3.3.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.2.0...gcp-cloud-run@3.3.0) (2021-12-09)


### Features

* **gcp-cloud-run:** Added option to generate repo info file ([8718b35](https://github.com/TriPSs/nx-extend/commit/8718b359424c2b8b6d635f1bf045dd4e57b0e51e))



# [3.2.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.1.0...gcp-cloud-run@3.2.0) (2021-12-07)


### Features

* **gcp-cloud-run:** Added support for secrets ([8ea4ff8](https://github.com/TriPSs/nx-extend/commit/8ea4ff838e67c8059163eabf9b2bd38193695d61))



# [3.1.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.0.1...gcp-cloud-run@3.1.0) (2021-11-04)


### Features

* **core:** Always log all executed commands ([5cf6365](https://github.com/TriPSs/nx-extend/commit/5cf6365a9edee096f46d30b34f9bcf1254e7c971))



## [3.0.1](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@3.0.0...gcp-cloud-run@3.0.1) (2021-11-04)


### Bug Fixes

* Always return promise ([43f4293](https://github.com/TriPSs/nx-extend/commit/43f42935887efd612da2661e6d4f640d900814eb))



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@2.0.2...gcp-cloud-run@3.0.0) (2021-10-28)


* feat!: Upgrade to NX 13 and remove angular `@angular-devkit` dependency ([b8d4b96](https://github.com/TriPSs/nx-extend/commit/b8d4b96aaba8a3ad245dc5d4487fff39241c1a48))


### BREAKING CHANGES

* Removed `@angular-devkit` dependency and executors / generators implementations are updated.



## [2.0.2](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@2.0.1...gcp-cloud-run@2.0.2) (2021-10-08)

### Bug Fixes

* Always write the docker file to the dist directory if option is
  defined ([d94c015](https://github.com/TriPSs/nx-extend/commit/d94c01542c239fb079b2eaa9f7fdb2e35a29d5b1))

## [2.0.1](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@2.0.0...gcp-cloud-run@2.0.1) (2021-10-08)

### Bug Fixes

* Fixed revisionSuffix always being
  added ([366ee2e](https://github.com/TriPSs/nx-extend/commit/366ee2eecb4948930d164060cbc9dfa66976e7e4))

# [2.0.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@1.2.0...gcp-cloud-run@2.0.0) (2021-10-08)

* feat!: Added support for artifact
  registry ([fe70271](https://github.com/TriPSs/nx-extend/commit/fe702710993138d55f3c81fc4d2f24e4c700234c))

### BREAKING CHANGES

* Building with artifact registry is now the default Set `buildWith` to `container-registery` to maintain old behaviour

# [1.2.0](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@1.1.5...gcp-cloud-run@1.2.0) (2021-10-08)

### Bug Fixes

* **gcp-cloud-run:** Fixed
  deploy ([9c2baf7](https://github.com/TriPSs/nx-extend/commit/9c2baf75f653e97db634f34ece64663d8b3a7319))
* Redeploy all apps ([42cc94f](https://github.com/TriPSs/nx-extend/commit/42cc94f1d8867ba33ee5be325f6c24343f299d74))
* Removed $id and $schema from
  schema.json ([c971396](https://github.com/TriPSs/nx-extend/commit/c9713967fae9d15f5351c4432a7f761361de5d55))
* **gcp-cloud-run:** Added
  concurrency ([01fa13a](https://github.com/TriPSs/nx-extend/commit/01fa13aad2b5754f834f28edd77b282fb988c674))

### Features

* **gcp-cloud-run:** Added logsDir
  option ([2490125](https://github.com/TriPSs/nx-extend/commit/2490125ca867131fe9bb60625290b1e51a3e6722))
* **gcp-functions:** Added entryPoint and serviceAccount
  options ([bdebec0](https://github.com/TriPSs/nx-extend/commit/bdebec09015ee4f7214173aef9553b547a7469af))
* Added gcp-cloud-run ([7990f05](https://github.com/TriPSs/nx-extend/commit/7990f05c286a59bfdea3e18bdf991690e678de24))

## [1.1.5](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@1.1.4...gcp-cloud-run@1.1.5) (2021-10-08)

### Bug Fixes

* Redeploy all apps ([c09ae4f](https://github.com/TriPSs/nx-extend/commit/c09ae4f2993b5e383ca7b02d3df66c93a0a64df5))

## [1.1.4](https://github.com/TriPSs/nx-extend/compare/gcp-cloud-run@1.1.3...gcp-cloud-run@1.1.4) (2021-10-08)
