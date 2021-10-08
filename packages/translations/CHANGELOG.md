# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [5.0.0](https://github.com/TriPSs/nx-extend/compare/translations@4.0.1...translations@5.0.0) (2021-10-08)


### Bug Fixes

* **translations:** Log how many terms there are ([beb0728](https://github.com/TriPSs/nx-extend/commit/beb072877f0851cff8f39823674e2a56068a47cf))
* Redeploy all apps ([42cc94f](https://github.com/TriPSs/nx-extend/commit/42cc94f1d8867ba33ee5be325f6c24343f299d74))
* **translations:** Fixed that not all roots of libs where added when extracting translations ([4c37af6](https://github.com/TriPSs/nx-extend/commit/4c37af65f80df08eaa744aefbb2913f48d541018))
* Removed $id and $schema from schema.json ([c971396](https://github.com/TriPSs/nx-extend/commit/c9713967fae9d15f5351c4432a7f761361de5d55))
* **translations:** Fix for Traduora not using project terms ([57f0d20](https://github.com/TriPSs/nx-extend/commit/57f0d20162652b77f8e45519cd7dd4e4912fc03e))
* **translations:** Fixed Traduora not translating empty strings ([885dd6b](https://github.com/TriPSs/nx-extend/commit/885dd6ba8b958a3ba10ac8bdc02f2584920a2443))
* **translations:** Small fixes ([12adfd0](https://github.com/TriPSs/nx-extend/commit/12adfd03b4010057ccef48dc4093bfde751494a7))


* feat(translations)!: Feat added Poeditor provided ([5871fc2](https://github.com/TriPSs/nx-extend/commit/5871fc21b062a6d49b76a6f0cb2756cb6e5cf008))


### Features

* **firebase-hosting:** Added firebase hosting to easily deploy sites to firebase ([e5fc4c6](https://github.com/TriPSs/nx-extend/commit/e5fc4c662c6d48d8ceffedeaf341f9e65054762a))
* **translations:** Added @nx-extend/translations module ([b134424](https://github.com/TriPSs/nx-extend/commit/b134424d98fb62f65b56bb6cb980015446240b6c))
* **translations:** Added DeepL translator support ([459dc2e](https://github.com/TriPSs/nx-extend/commit/459dc2e3924b12199e6aee4141203991e3b0c240))
* **translations:** Added formatters for extracting ([ba36b12](https://github.com/TriPSs/nx-extend/commit/ba36b120be4e970a9d6ba38d2408d4f548b5f8b3))
* **translations:** Added option to also extract from connected libs ([30c95c1](https://github.com/TriPSs/nx-extend/commit/30c95c13472ecb0b877294cb7706c6ad280b7df1))
* **translations:** Added push / pull for Traduora ([a00830c](https://github.com/TriPSs/nx-extend/commit/a00830cc222a2db47e37febcce0b54162cb9f312))
* **translations:** Added support to get Traduora keys from defined env variable ([aed0c76](https://github.com/TriPSs/nx-extend/commit/aed0c76c54a0542e04290eea687d621482f3d198))
* **translations:** Added the option to give formality for deepl translations ([e88de19](https://github.com/TriPSs/nx-extend/commit/e88de197cdc42492e538f4d1a246180fb6d7b506))
* **translations:** Added Traduora provider ([06f78d0](https://github.com/TriPSs/nx-extend/commit/06f78d0d805ccb9399c6e0cf07e9f5cbae7aec75))
* **translations:** Added Transifex provider ([e6ee4a5](https://github.com/TriPSs/nx-extend/commit/e6ee4a5540dafc676c75c38aa8f5f573f24e3084))
* **translations:** Also take deps of libs into account when extracting ([575d62c](https://github.com/TriPSs/nx-extend/commit/575d62c90a87f06a73ce5c1291c41424b81982ed))
* **translations:** Get clientId and clientSecret from env ([030c6f6](https://github.com/TriPSs/nx-extend/commit/030c6f653cdd4d5f4bb75f9e860257c6be2c20ce))


### BREAKING CHANGES

* Configs are now more aligned and support extends syntax
* **translations:** Default extractor changed from react-intl to formatjs
* **translations:** The configs for the providers has changes



## [4.0.1](https://github.com/TriPSs/nx-extend/compare/translations@4.0.0...translations@4.0.1) (2021-10-08)


### Bug Fixes

* Redeploy all apps ([c09ae4f](https://github.com/TriPSs/nx-extend/commit/c09ae4f2993b5e383ca7b02d3df66c93a0a64df5))



# [4.0.0](https://github.com/TriPSs/nx-extend/compare/translations@3.3.0...translations@4.0.0) (2021-10-08)


* feat(translations)!: Feat added Poeditor provided ([3a947f0](https://github.com/TriPSs/nx-extend/commit/3a947f03ff8d6eeef67b68e03aade7e6eb052d8d))


### BREAKING CHANGES

* Configs are now more aligned and support extends syntax
