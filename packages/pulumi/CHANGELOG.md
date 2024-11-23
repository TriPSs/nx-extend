 
## [8.1.1](https://github.com/tripss/nx-extend/compare/pulumi@8.1.0...pulumi@8.1.1) (2024-10-24)



# [8.1.0](https://github.com/tripss/nx-extend/compare/pulumi@8.0.0...pulumi@8.1.0) (2024-10-24)

### Dependency Updates

* `core` updated to version `8.1.0`

### Features

* Update NX peerDependencies to v20.0.0 ([67e1f69](https://github.com/tripss/nx-extend/commit/67e1f69f0d5cdde653858224af6ddd89c91f7309))



# [8.0.0](https://github.com/tripss/nx-extend/compare/pulumi@7.3.5...pulumi@8.0.0) (2024-10-11)


### Features

* Update to NX v20.0.0 ([78dad2e](https://github.com/tripss/nx-extend/commit/78dad2e7a71d42ebf6bb9416389e4fdcb277313c))


### BREAKING CHANGES

* NX is updated to v20.0.0



## [7.3.5](https://github.com/tripss/nx-extend/compare/pulumi@7.3.4...pulumi@7.3.5) (2024-10-10)



## [7.3.4](https://github.com/tripss/nx-extend/compare/pulumi@7.3.3...pulumi@7.3.4) (2024-10-10)



## [7.3.3](https://github.com/tripss/nx-extend/compare/pulumi@7.3.2...pulumi@7.3.3) (2024-09-23)



## [7.3.2](https://github.com/tripss/nx-extend/compare/pulumi@7.3.1...pulumi@7.3.2) (2024-09-06)

### Dependency Updates

* `core` updated to version `8.0.2`


## [7.3.1](https://github.com/tripss/nx-extend/compare/pulumi@7.3.0...pulumi@7.3.1) (2024-09-06)

### Dependency Updates

* `core` updated to version `8.0.1`


# [7.3.0](https://github.com/tripss/nx-extend/compare/pulumi@7.2.0...pulumi@7.3.0) (2024-09-05)


### Features

* **pulumi-gcp:** Add PubSub editor role ([b15bfb9](https://github.com/tripss/nx-extend/commit/b15bfb96af4ba05d8306fe9f959ea3da5c7e2284))



# [7.2.0](https://github.com/tripss/nx-extend/compare/pulumi@7.1.1...pulumi@7.2.0) (2024-08-26)


### Bug Fixes

* **pulumi:** Simplify IAM custom role creation using args spread ([7471839](https://github.com/tripss/nx-extend/commit/7471839c32a387092cf890d76336cad10c00411f))


### Features

* **pulumi:** Refactor import organization and remove unused code ([eda0431](https://github.com/tripss/nx-extend/commit/eda0431327e7752202f1b6074b800b2e9659c338))



## [7.1.1](https://github.com/tripss/nx-extend/compare/pulumi@7.1.0...pulumi@7.1.1) (2024-08-26)



# [7.1.0](https://github.com/tripss/nx-extend/compare/pulumi@7.0.0...pulumi@7.1.0) (2024-08-23)


### Features

* **pulumi:** Add GCP resource classes for service account, IAM custom role, Pub/Sub topic, IAM binding, DNS, and utility functions ([64e69b4](https://github.com/tripss/nx-extend/commit/64e69b488f647e79fae79dca09067c2dd1607942))



# [7.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@6.2.3...pulumi@7.0.0) (2024-08-16)

### Dependency Updates

* `core` updated to version `8.0.0`

### Features

* Added `@nx/devkit` to `peerDependencies` ([2e2dd2b](https://github.com/TriPSs/nx-extend/commit/2e2dd2b997699f9d949b84cd8e96674b43725e56))


### BREAKING CHANGES

* `@nx/devkit` no longer included as dependency



## [6.2.3](https://github.com/TriPSs/nx-extend/compare/pulumi@6.2.2...pulumi@6.2.3) (2024-06-17)

### Dependency Updates

* `core` updated to version `7.0.3`


## [6.2.2](https://github.com/TriPSs/nx-extend/compare/pulumi@6.2.1...pulumi@6.2.2) (2024-06-14)

### Dependency Updates

* `core` updated to version `7.0.2`

### Bug Fixes

* Re-add dep options that where supposed to be deprecated ([3854a73](https://github.com/TriPSs/nx-extend/commit/3854a73f3ba70453cf1cf7c8c82122eb17364bb8))



## [6.2.1](https://github.com/TriPSs/nx-extend/compare/pulumi@6.2.0...pulumi@6.2.1) (2024-06-14)

### Dependency Updates

* `core` updated to version `7.0.1`


# [6.2.0](https://github.com/TriPSs/nx-extend/compare/pulumi@6.1.0...pulumi@6.2.0) (2024-05-30)


### Features

* **pulumi:** Added `showSecrets` in `config` executor ([1fa045a](https://github.com/TriPSs/nx-extend/commit/1fa045ab2c917e3e06becb565f4b8fdd1521e3b8))



# [6.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@6.0.0...pulumi@6.1.0) (2024-05-16)


### Features

* **pulumi:** Added `config` executor ([970507f](https://github.com/TriPSs/nx-extend/commit/970507f914cbee1daa961e080e027b622b71ed10))
* **pulumi:** Added `expectNoChanges` option to preview executor ([a42223b](https://github.com/TriPSs/nx-extend/commit/a42223baac2673893189c2b9846eca363ac04f44))
* **pulumi:** Added `path` to `config` generator ([dcca572](https://github.com/TriPSs/nx-extend/commit/dcca5724f06b0f08ed9d5d06ab20d2c8eceb8c7f))



# [6.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.1.0...pulumi@6.0.0) (2024-05-15)

### Dependency Updates

* `core` updated to version `7.0.0`

### Features

* **pulumi:** Added `import` executor ([09064e5](https://github.com/TriPSs/nx-extend/commit/09064e5b64a6e10be3552e8d96c326883d99ca4c))
* Updated Nx ([79325aa](https://github.com/TriPSs/nx-extend/commit/79325aa06e0251f45dbf295f6c19fc417a301fc7))


### BREAKING CHANGES

* Updated to Nx 19



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.6...pulumi@5.1.0) (2024-05-07)


### Features

* **pulumi:** Move setup of typescript to package ([ac6b939](https://github.com/TriPSs/nx-extend/commit/ac6b939e44273416aef6cbba49959f9b79d9d308))



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.6...pulumi@5.1.0) (2024-05-07)


### Features

* **pulumi:** Move setup of typescript to package ([ac6b939](https://github.com/TriPSs/nx-extend/commit/ac6b939e44273416aef6cbba49959f9b79d9d308))



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.6...pulumi@5.1.0) (2024-05-07)


### Features

* **pulumi:** Move setup of typescript to package ([ac6b939](https://github.com/TriPSs/nx-extend/commit/ac6b939e44273416aef6cbba49959f9b79d9d308))



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.6...pulumi@5.1.0) (2024-05-07)


### Features

* **pulumi:** Move setup of typescript to package ([ac6b939](https://github.com/TriPSs/nx-extend/commit/ac6b939e44273416aef6cbba49959f9b79d9d308))



# [5.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.6...pulumi@5.1.0) (2024-05-05)


### Features

* **pulumi:** Move setup of typescript to package ([ac6b939](https://github.com/TriPSs/nx-extend/commit/ac6b939e44273416aef6cbba49959f9b79d9d308))



## [5.0.6](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.5...pulumi@5.0.6) (2024-05-04)



## [5.0.5](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.4...pulumi@5.0.5) (2024-04-30)


### Bug Fixes

* add missing stack property ([73c5618](https://github.com/TriPSs/nx-extend/commit/73c561815ccf50d326125308eb95aab461b7b4fd))



## [5.0.4](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.3...pulumi@5.0.4) (2024-03-06)



## [5.0.3](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.2...pulumi@5.0.3) (2024-02-09)


### Bug Fixes

* **pulumi:** Release ([7ab95f3](https://github.com/TriPSs/nx-extend/commit/7ab95f33ab3bbcd54e1dfe9d5fc89d5e62937c6d))



## [5.0.2](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.1...pulumi@5.0.2) (2024-02-09)


### Bug Fixes

* **pulumi:** Release ([132f991](https://github.com/TriPSs/nx-extend/commit/132f991d325e394821b3230c43c63345766e2c9a))



## [5.0.1](https://github.com/TriPSs/nx-extend/compare/pulumi@5.0.0...pulumi@5.0.1) (2024-02-09)



# [5.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@4.1.1...pulumi@5.0.0) (2024-02-08)


### Features

* Updated Nx ([db61114](https://github.com/TriPSs/nx-extend/commit/db61114abc4991ae0e66ade0660b2baee76263f0))


### BREAKING CHANGES

* Updated Nx to version 18



## [4.1.1](https://github.com/TriPSs/nx-extend/compare/pulumi@4.1.0...pulumi@4.1.1) (2023-12-09)



# [4.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@4.0.0...pulumi@4.1.0) (2023-12-07)


### Features

* **pulumi:** Added `root` option ([#190](https://github.com/TriPSs/nx-extend/issues/190)) ([75435d3](https://github.com/TriPSs/nx-extend/commit/75435d3714a0c1d92fb2ff182b12a8ee4e03ff2c))



# [4.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.4.2...pulumi@4.0.0) (2023-10-31)


### Features

* Update to NX 17 ([c21accb](https://github.com/TriPSs/nx-extend/commit/c21accbed588d43cb5a53b4ce5d061722e7740f2))


### BREAKING CHANGES

* Updated to NX 17



## [3.4.2](https://github.com/TriPSs/nx-extend/compare/pulumi@3.4.1...pulumi@3.4.2) (2023-10-02)



## [3.4.1](https://github.com/TriPSs/nx-extend/compare/pulumi@3.4.0...pulumi@3.4.1) (2023-10-02)


### Bug Fixes

* **pulumi:** Foce release ([cbd5e01](https://github.com/TriPSs/nx-extend/commit/cbd5e01f355ac736a6f296ba6871bfe41440a469))



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.3.0...pulumi@3.4.0) (2023-10-02)


### Bug Fixes

* add target ([70b59d8](https://github.com/TriPSs/nx-extend/commit/70b59d8fbb33006ecca86eb90e63192f85a88ad0))
* compile issues ([2168ba2](https://github.com/TriPSs/nx-extend/commit/2168ba2bad576669dbec169cfd9fa51f8837c6d5))
* forgot to add to executors ([e69c261](https://github.com/TriPSs/nx-extend/commit/e69c261c4e13b6141ffce2452bf2b0bcfbe90b3c))
* issue making it impossible to use stack references ([#162](https://github.com/TriPSs/nx-extend/issues/162)) ([13f3b71](https://github.com/TriPSs/nx-extend/commit/13f3b71af45d4bc15530ad5bc873525b082fdfcb))


### Features

* refresh executor ([6407609](https://github.com/TriPSs/nx-extend/commit/640760984a777c730c8bfcdd391af2f3eb100766))



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.3.0...pulumi@3.4.0) (2023-10-02)


### Bug Fixes

* add target ([70b59d8](https://github.com/TriPSs/nx-extend/commit/70b59d8fbb33006ecca86eb90e63192f85a88ad0))
* compile issues ([2168ba2](https://github.com/TriPSs/nx-extend/commit/2168ba2bad576669dbec169cfd9fa51f8837c6d5))
* forgot to add to executors ([e69c261](https://github.com/TriPSs/nx-extend/commit/e69c261c4e13b6141ffce2452bf2b0bcfbe90b3c))
* issue making it impossible to use stack references ([#162](https://github.com/TriPSs/nx-extend/issues/162)) ([13f3b71](https://github.com/TriPSs/nx-extend/commit/13f3b71af45d4bc15530ad5bc873525b082fdfcb))


### Features

* refresh executor ([6407609](https://github.com/TriPSs/nx-extend/commit/640760984a777c730c8bfcdd391af2f3eb100766))



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.3.0...pulumi@3.4.0) (2023-10-02)


### Bug Fixes

* add target ([70b59d8](https://github.com/TriPSs/nx-extend/commit/70b59d8fbb33006ecca86eb90e63192f85a88ad0))
* compile issues ([2168ba2](https://github.com/TriPSs/nx-extend/commit/2168ba2bad576669dbec169cfd9fa51f8837c6d5))
* issue making it impossible to use stack references ([#162](https://github.com/TriPSs/nx-extend/issues/162)) ([13f3b71](https://github.com/TriPSs/nx-extend/commit/13f3b71af45d4bc15530ad5bc873525b082fdfcb))


### Features

* refresh executor ([6407609](https://github.com/TriPSs/nx-extend/commit/640760984a777c730c8bfcdd391af2f3eb100766))



# [3.3.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.2.3...pulumi@3.3.0) (2023-09-25)


### Bug Fixes

* eslint breaking import order ([5c507d4](https://github.com/TriPSs/nx-extend/commit/5c507d4f2e68e9c49ac5c21acae05c91faead640)), closes [#157](https://github.com/TriPSs/nx-extend/issues/157)
* eslint breaking import order ([#158](https://github.com/TriPSs/nx-extend/issues/158)) ([1f88e4d](https://github.com/TriPSs/nx-extend/commit/1f88e4d7d471065c3274a36453887189ce39ca0a)), closes [#157](https://github.com/TriPSs/nx-extend/issues/157)
* typo ([34b5437](https://github.com/TriPSs/nx-extend/commit/34b5437c336f17ccd39a8998a31bbb82660a8c37))


### Features

* add helper for strong-typed stack references ([cd427c1](https://github.com/TriPSs/nx-extend/commit/cd427c13503a5847faae141406685497c60c3d23))



## [3.2.4](https://github.com/TriPSs/nx-extend/compare/pulumi@3.2.3...pulumi@3.2.4) (2023-09-18)


### Bug Fixes

* eslint breaking import order ([5c507d4](https://github.com/TriPSs/nx-extend/commit/5c507d4f2e68e9c49ac5c21acae05c91faead640)), closes [#157](https://github.com/TriPSs/nx-extend/issues/157)
* eslint breaking import order ([#158](https://github.com/TriPSs/nx-extend/issues/158)) ([1f88e4d](https://github.com/TriPSs/nx-extend/commit/1f88e4d7d471065c3274a36453887189ce39ca0a)), closes [#157](https://github.com/TriPSs/nx-extend/issues/157)
* typo ([34b5437](https://github.com/TriPSs/nx-extend/commit/34b5437c336f17ccd39a8998a31bbb82660a8c37))



## [3.2.3](https://github.com/TriPSs/nx-extend/compare/pulumi@3.2.2...pulumi@3.2.3) (2023-09-14)


### Bug Fixes

* **pulumi:** Use minimal logging ([c32c883](https://github.com/TriPSs/nx-extend/commit/c32c883bf75cbf72e13439662087eebc954b2495)), closes [#154](https://github.com/TriPSs/nx-extend/issues/154)



## [3.2.2](https://github.com/TriPSs/nx-extend/compare/pulumi@3.2.1...pulumi@3.2.2) (2023-09-14)


### Bug Fixes

* eslint does not support typescript ([24b4fba](https://github.com/TriPSs/nx-extend/commit/24b4fbaa0432edf93d960292d3f1c440dfa351f7))



## [3.2.1](https://github.com/TriPSs/nx-extend/compare/pulumi@3.2.0...pulumi@3.2.1) (2023-08-31)



# [3.2.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.1.3...pulumi@3.2.0) (2023-08-25)


### Features

* **pulumi:** Add support for suppress-outputs, debug, and json command-line arguments ([9b70248](https://github.com/TriPSs/nx-extend/commit/9b702485a55149221cd1334e7453cc9839668df6))



## [3.1.3](https://github.com/TriPSs/nx-extend/compare/pulumi@3.1.2...pulumi@3.1.3) (2023-08-23)



## [3.1.2](https://github.com/TriPSs/nx-extend/compare/pulumi@3.1.1...pulumi@3.1.2) (2023-08-23)



## [3.1.1](https://github.com/TriPSs/nx-extend/compare/pulumi@3.1.0...pulumi@3.1.1) (2023-08-06)


### Bug Fixes

* **pulumi:** Fixed init generator ([ae88bec](https://github.com/TriPSs/nx-extend/commit/ae88beccb9fc3e677bde7a7241db0f90fce88742))



# [3.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@3.0.0...pulumi@3.1.0) (2023-06-22)


### Features

* Added `publish` target ([6f1844f](https://github.com/TriPSs/nx-extend/commit/6f1844f792b704d63fca2663363ca0f65fe6451c))



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@2.0.0...pulumi@3.0.0) (2023-06-22)



# [2.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@1.0.0...pulumi@2.0.0) (2023-06-22)



# [1.0.0](https://github.com/TriPSs/nx-extend/compare/pulumi@0.1.2...pulumi@1.0.0) (2023-06-22)


### Features

* Updated to NX 16 ([4896bf6](https://github.com/TriPSs/nx-extend/commit/4896bf66940e1b69e0f2e3971a7864a1da20b2ef))


### BREAKING CHANGES

* Updated to NX 16



## [0.1.2](https://github.com/TriPSs/nx-extend/compare/pulumi@0.1.1...pulumi@0.1.2) (2023-03-30)



## [0.1.1](https://github.com/TriPSs/nx-extend/compare/pulumi@0.1.0...pulumi@0.1.1) (2023-03-15)


### Bug Fixes

* **pulumi:** Added eslint template file ([d849d81](https://github.com/TriPSs/nx-extend/commit/d849d819601b0151b41cadc3a3296b7dd5e7aab5))



# [0.1.0](https://github.com/TriPSs/nx-extend/compare/pulumi@0.0.1...pulumi@0.1.0) (2022-12-31)


### Bug Fixes

* **pulumi:** Fixed loading of libs not working ([8bbfc55](https://github.com/TriPSs/nx-extend/commit/8bbfc55e4bdb83c8e8a6ecc1496b75faaddd0e75))


### Features

* **pulumi:** Extend the typescript file ([78ccd78](https://github.com/TriPSs/nx-extend/commit/78ccd78f97cd238fcb03c054a6f8516523b94dbb))
