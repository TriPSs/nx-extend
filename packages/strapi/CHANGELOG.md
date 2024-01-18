# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [8.0.7](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.6...strapi@8.0.7) (2024-01-18)



## [8.0.6](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.5...strapi@8.0.6) (2023-12-24)



## [8.0.5](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.4...strapi@8.0.5) (2023-12-13)


### Bug Fixes

* **strapi:** Use cached project graph for `withNx` ([afc270f](https://github.com/TriPSs/nx-extend/commit/afc270f515a5a2897d28ec257b050bfb3358b2fa))



## [8.0.4](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.3...strapi@8.0.4) (2023-12-09)



## [8.0.3](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.2...strapi@8.0.3) (2023-12-01)



## [8.0.2](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.1...strapi@8.0.2) (2023-11-29)


### Bug Fixes

* **strapi:** Ignore all prompts when serving ([d48db66](https://github.com/TriPSs/nx-extend/commit/d48db66616e82b6a5c9014935e4a6ee90485c0ae))



## [8.0.1](https://github.com/TriPSs/nx-extend/compare/strapi@8.0.0...strapi@8.0.1) (2023-11-21)



# [8.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@7.0.1...strapi@8.0.0) (2023-11-21)


### Features

* **strapi:** Implement new Strapi build ([0cbf730](https://github.com/TriPSs/nx-extend/commit/0cbf73019833eaeddb4647ea27121570efb71b54))


### BREAKING CHANGES

* **strapi:** The build implementation changed causing the `src/admin/webpack.config.js` to be updated with `withNx`.
See [webpack.config.js.template](./packages/strapi/src/generators/init/files/src/admin/webpack.config.js.template).
Also the `tsConfig` option is now required.



## [7.0.1](https://github.com/TriPSs/nx-extend/compare/strapi@7.0.0...strapi@7.0.1) (2023-10-31)


### Bug Fixes

* **strapi:** Fixed build crashing ([347b18e](https://github.com/TriPSs/nx-extend/commit/347b18e3480d32759a98b3ab598651c771c1e759))
* **strapi:** Fixed build crashing ([#174](https://github.com/TriPSs/nx-extend/issues/174)) ([66edb2a](https://github.com/TriPSs/nx-extend/commit/66edb2ad17a0981e789787abe17408eb72887a4d))



# [7.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.8...strapi@7.0.0) (2023-10-31)


### chore

* Updated deps + NX ([5b07fa8](https://github.com/TriPSs/nx-extend/commit/5b07fa8fd4d2aeb0599ea71a0a1f2bb25287618e))


* Force release with breaking change (#173) ([4517a65](https://github.com/TriPSs/nx-extend/commit/4517a65729e2aee542bedf3c728675e1c3141a6b)), closes [#173](https://github.com/TriPSs/nx-extend/issues/173)


### Features

* Update to NX 17 ([c21accb](https://github.com/TriPSs/nx-extend/commit/c21accbed588d43cb5a53b4ce5d061722e7740f2))
* Use package manager instead of npx when running commands ([f649413](https://github.com/TriPSs/nx-extend/commit/f649413c682f493a00c59c9ee09ed1ff45df1d77))


### BREAKING CHANGES

* Updated to NX 17
* Updated to NX 17
* Updated to NX 17



## [6.1.8](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.7...strapi@6.1.8) (2023-10-05)



## [6.1.7](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.6...strapi@6.1.7) (2023-09-14)



## [6.1.6](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.5...strapi@6.1.6) (2023-09-07)



## [6.1.5](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.4...strapi@6.1.5) (2023-08-31)



## [6.1.4](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.3...strapi@6.1.4) (2023-08-25)



## [6.1.3](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.2...strapi@6.1.3) (2023-08-06)



## [6.1.2](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.1...strapi@6.1.2) (2023-07-12)



## [6.1.1](https://github.com/TriPSs/nx-extend/compare/strapi@6.1.0...strapi@6.1.1) (2023-06-28)


### Bug Fixes

* **strapi:** Correctly generate Strapi project ([e2c0107](https://github.com/TriPSs/nx-extend/commit/e2c01078f8fd9a503988c2e49815e1378dd3c782)), closes [#110](https://github.com/TriPSs/nx-extend/issues/110)
* **strapi:** If defined root is different then project root copy dependencies from project root package.json ([85c72d6](https://github.com/TriPSs/nx-extend/commit/85c72d606120a017cae4d7ff79220c950be0ad34))



# [6.1.0](https://github.com/TriPSs/nx-extend/compare/strapi@6.0.0...strapi@6.1.0) (2023-06-22)


### Features

* Added `publish` target ([6f1844f](https://github.com/TriPSs/nx-extend/commit/6f1844f792b704d63fca2663363ca0f65fe6451c))



# [6.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@5.0.0...strapi@6.0.0) (2023-06-22)



# [5.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@4.0.0...strapi@5.0.0) (2023-06-22)



# [4.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.5.2...strapi@4.0.0) (2023-06-22)


### Features

* Updated to NX 16 ([4896bf6](https://github.com/TriPSs/nx-extend/commit/4896bf66940e1b69e0f2e3971a7864a1da20b2ef))


### BREAKING CHANGES

* Updated to NX 16



## [3.5.2](https://github.com/TriPSs/nx-extend/compare/strapi@3.5.1...strapi@3.5.2) (2023-05-26)



## [3.5.1](https://github.com/TriPSs/nx-extend/compare/strapi@3.5.0...strapi@3.5.1) (2023-03-30)



# [3.5.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.4.0...strapi@3.5.0) (2023-03-23)


### Features

* **strapi:** Update to latest strapi ([e7d7e6d](https://github.com/TriPSs/nx-extend/commit/e7d7e6d3299a2d2e0b2d5393b2d335da6d684880)), closes [#113](https://github.com/TriPSs/nx-extend/issues/113)



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.3.0...strapi@3.4.0) (2023-01-26)


### Features

* Implemented NX lockfile generation ([7638951](https://github.com/TriPSs/nx-extend/commit/76389510501ee3e850fca9cf9f675d70448dbf91))



# [3.3.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.2.0...strapi@3.3.0) (2023-01-25)


### Features

* **strapi:** Updated Strapi to latest version ([01cf893](https://github.com/TriPSs/nx-extend/commit/01cf893c2cd375dda98a92a838eb8649f8dff5e4))
* **strapi:** Updated Strapi to latest version ([09a518b](https://github.com/TriPSs/nx-extend/commit/09a518b61e71248dc121d1b0d08afe3a132d2462))



# [3.2.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.1.2...strapi@3.2.0) (2022-12-19)


### Features

* **strapi:** Updated Strapi to latest version ([503babf](https://github.com/TriPSs/nx-extend/commit/503babf107f70e416a34e7775ea970b876200c4a))



## [3.1.2](https://github.com/TriPSs/nx-extend/compare/strapi@3.1.1...strapi@3.1.2) (2022-11-17)



## [3.1.1](https://github.com/TriPSs/nx-extend/compare/strapi@3.1.0...strapi@3.1.1) (2022-09-14)



# [3.1.0](https://github.com/TriPSs/nx-extend/compare/strapi@3.0.3...strapi@3.1.0) (2022-09-13)


### Features

* **strapi:** Added support for the `root` option in `build` and `serve` ([874829c](https://github.com/TriPSs/nx-extend/commit/874829cb306e7d8216c475dfdac3d79bdadef7be))



## [3.0.3](https://github.com/TriPSs/nx-extend/compare/strapi@3.0.2...strapi@3.0.3) (2022-09-06)


### Bug Fixes

* **strapi:** Always use root ([3234a4f](https://github.com/TriPSs/nx-extend/commit/3234a4fa1dc3ce956590245cac70b723f1e8cfc6))



## [3.0.2](https://github.com/TriPSs/nx-extend/compare/strapi@3.0.1...strapi@3.0.2) (2022-09-04)


### Bug Fixes

* **strapi:** Prefer `sourceRoot` over `root` when building ([f59f37e](https://github.com/TriPSs/nx-extend/commit/f59f37ec5e8490a6c6c50cbd9b8b4e46d9dab9f7))



## [3.0.1](https://github.com/TriPSs/nx-extend/compare/strapi@3.0.0...strapi@3.0.1) (2022-08-25)


### Bug Fixes

* **strapi:** Also copy the favicon ([3763a19](https://github.com/TriPSs/nx-extend/commit/3763a19c9b5f2de6b822813d78bd8d24aab99dbe))



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@2.2.1...strapi@3.0.0) (2022-08-24)


### Features

* **strapi:** Improved `@nx-extend/strapi:build` ([80c2cc3](https://github.com/TriPSs/nx-extend/commit/80c2cc36691e4a8b4695375fd5835a239dc674b4))


### BREAKING CHANGES

* **strapi:** `outputPath` is now a required option



## [2.2.1](https://github.com/TriPSs/nx-extend/compare/strapi@2.2.0...strapi@2.2.1) (2022-08-05)


### Bug Fixes

* **strapi:** Update strapi dep ([8703c7d](https://github.com/TriPSs/nx-extend/commit/8703c7de3f4ca7dadd71d6b116b79df354dd6166))



# [2.2.0](https://github.com/TriPSs/nx-extend/compare/strapi@2.1.2...strapi@2.2.0) (2022-08-05)


### Features

* **strapi:** Generate typescript projects ([298c885](https://github.com/TriPSs/nx-extend/commit/298c885ba097c2bbb8a973d3180ed7faa28ac046))



## [2.1.2](https://github.com/TriPSs/nx-extend/compare/strapi@2.1.1...strapi@2.1.2) (2022-06-15)


### Bug Fixes

* Re-release all ([2696931](https://github.com/TriPSs/nx-extend/commit/26969318cadada2173710dac9ad1b52257c31760))



## [2.1.2](https://github.com/TriPSs/nx-extend/compare/strapi@2.1.1...strapi@2.1.2) (2022-06-15)



## [2.1.1](https://github.com/TriPSs/nx-extend/compare/strapi@2.1.0...strapi@2.1.1) (2022-05-24)



# [2.1.0](https://github.com/TriPSs/nx-extend/compare/strapi@2.0.2...strapi@2.1.0) (2022-04-25)


### Features

* add arguments to the strapi serve command ([3023593](https://github.com/TriPSs/nx-extend/commit/30235936cf46b9e61e5725b86bf949dbf23a7872))



## [2.0.2](https://github.com/TriPSs/nx-extend/compare/strapi@2.0.1...strapi@2.0.2) (2022-01-25)


### Bug Fixes

* **strapi:** update to strapi v4 ([468268c](https://github.com/TriPSs/nx-extend/commit/468268c8829716d1264386e41ad83da520aa0a03)), closes [#32](https://github.com/TriPSs/nx-extend/issues/32) [#38](https://github.com/TriPSs/nx-extend/issues/38)



## [2.0.1](https://github.com/TriPSs/nx-extend/compare/strapi@2.0.0...strapi@2.0.1) (2021-11-04)


### Bug Fixes

* Always return promise ([43f4293](https://github.com/TriPSs/nx-extend/commit/43f42935887efd612da2661e6d4f640d900814eb))



# [2.0.0](https://github.com/TriPSs/nx-extend/compare/strapi@1.0.5...strapi@2.0.0) (2021-10-28)


### Bug Fixes

* Fixes in build ([eb1b9f1](https://github.com/TriPSs/nx-extend/commit/eb1b9f11fce7565db4c62ab760ba096878df0383))


* feat!: Upgrade to NX 13 and remove angular `@angular-devkit` dependency ([dbcc0b2](https://github.com/TriPSs/nx-extend/commit/dbcc0b207c5c27a3879f23e99753ac7276cbba95))


### BREAKING CHANGES

* Removed `@angular-devkit` dependency and executors / generators implementations are updated.



## [1.0.5](https://github.com/TriPSs/nx-extend/compare/strapi@1.0.4...strapi@1.0.5) (2021-10-08)

### Bug Fixes

* Redeploy all apps ([c09ae4f](https://github.com/TriPSs/nx-extend/commit/c09ae4f2993b5e383ca7b02d3df66c93a0a64df5))
