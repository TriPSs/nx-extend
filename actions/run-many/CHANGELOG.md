# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.4.1](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.4.0...actions-run-many@3.4.1) (2023-08-06)


### Bug Fixes

* **action-run-many:** Added support to disable the `--affected` ([44cefc2](https://github.com/TriPSs/nx-extend/commit/44cefc2262f25abdd1f63586f9e5798b1710cb1f))



# [3.4.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.3.0...actions-run-many@3.4.0) (2023-07-27)


### Features

* **actions-run-many:** Always log with `--output-style=stream` for better readability ([7c3c445](https://github.com/TriPSs/nx-extend/commit/7c3c445635053747b3d8cce36c465273437c1a1d))
* **actions:** Added support for `AND` condition in tag ([3fdf7c6](https://github.com/TriPSs/nx-extend/commit/3fdf7c645c378ba3398335d696fd225545f08444))
* **actions:** Added support to run tags with conditions ([cb0e023](https://github.com/TriPSs/nx-extend/commit/cb0e023f052e3e88d548272d7d6b75bb453adc44))



# [3.3.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.2.0...actions-run-many@3.3.0) (2023-07-13)


### Bug Fixes

* **actions-run-many:** Corrected table column of summary ([35811cd](https://github.com/TriPSs/nx-extend/commit/35811cde7aa5715b5cc27e22e0f8f674ed83ce00))


### Features

* **actions:** Use new affected command ([3af25dc](https://github.com/TriPSs/nx-extend/commit/3af25dccf3a8b0e69b76c65618c7219cf2e8cf04))



# [3.2.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.1.0...actions-run-many@3.2.0) (2023-07-01)


### Bug Fixes

* **actions-run-many:** Correctly get projects ([614b989](https://github.com/TriPSs/nx-extend/commit/614b9893cd1d299629a62144f457a13505972df4))


### Features

* **actions-run-many:** Support multiple tags ([c19e0b1](https://github.com/TriPSs/nx-extend/commit/c19e0b1de9bc2160689470457f4786089e480a88))


### Reverts

* Revert "feat(actions-run-many): When running in dry more output affected" ([41b3e2e](https://github.com/TriPSs/nx-extend/commit/41b3e2e39a08a1d7f6bf88710e93d3f9eb0f2a16))



# [3.1.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.0.1...actions-run-many@3.1.0) (2023-06-28)


### Features

* **gcp-functions:** Improved function runner ([125ba6b](https://github.com/TriPSs/nx-extend/commit/125ba6b0fea207c5d92c3f09058c65b0ff73fe20))



## [3.0.1](https://github.com/TriPSs/nx-extend/compare/actions-run-many@3.0.0...actions-run-many@3.0.1) (2023-06-22)


### Bug Fixes

* Fix `readWorkspace` being undefined ([0b66879](https://github.com/TriPSs/nx-extend/commit/0b66879c009a7935c3f13e0006b18c0e0266d611))



# [3.0.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@2.0.0...actions-run-many@3.0.0) (2023-06-22)



# [2.0.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.6.1...actions-run-many@2.0.0) (2023-06-22)



## [1.6.1](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.6.0...actions-run-many@1.6.1) (2023-06-22)



# [1.6.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.5.1...actions-run-many@1.6.0) (2023-01-25)


### Bug Fixes

* **run-many:** Added `workingDirectory` to action yml ([f730978](https://github.com/TriPSs/nx-extend/commit/f7309785a96f335362c38d83e3eda28647ce2752))


### Features

* **run-many:** Added `workingDirectory` support ([196da75](https://github.com/TriPSs/nx-extend/commit/196da75cb339a200303054cbd762b550e9b761aa))



## [1.5.1](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.5.0...actions-run-many@1.5.1) (2022-12-08)


### Bug Fixes

* **run-many:** Added `config` to action.yml ([40b6cd3](https://github.com/TriPSs/nx-extend/commit/40b6cd36d4ef315ac9c91aa0aeecd1a589c6d426))



# [1.5.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.4.0...actions-run-many@1.5.0) (2022-12-08)


### Features

* **run-many:** Added support to define `config` ([04f5235](https://github.com/TriPSs/nx-extend/commit/04f52359d179748c4957888da15eb3e6f0f4df15))



# [1.4.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.3.0...actions-run-many@1.4.0) (2022-12-08)


### Bug Fixes

* **actions-run-many:** Fixed projects having `/n` in the name causing then not to be "affected" ([b3f7e06](https://github.com/TriPSs/nx-extend/commit/b3f7e062073adf5485a22b462abb273d5e29ba94))


### Features

* **run-many:** Log to console when Github actions run in debug mode ([5bf1795](https://github.com/TriPSs/nx-extend/commit/5bf1795137c3f2687eb2b048222d88a9429ac6cf))



# [1.3.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.2.0...actions-run-many@1.3.0) (2022-11-17)


### Features

* **actions-run-many:** Also publish as script ([2be2b48](https://github.com/TriPSs/nx-extend/commit/2be2b4801f35074ab58238010a9503b5fc766566))
* **actions-run-many:** Correctly include libs when running ([c5dfaa7](https://github.com/TriPSs/nx-extend/commit/c5dfaa762e8765122ccd83a9105eab20ee95309e))



# [1.2.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.1.0...actions-run-many@1.2.0) (2022-09-15)


### Features

* **run-many:** Added pre/post targets ([2f86c25](https://github.com/TriPSs/nx-extend/commit/2f86c25fa34b083013e502532c0507fb06e4475d))



# [1.1.0](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.0.1...actions-run-many@1.1.0) (2022-09-15)


### Features

* **run-many:** Allow for defining different target to determine affected ([97b9c8c](https://github.com/TriPSs/nx-extend/commit/97b9c8c0da0eba205eb3081a9e162d5dfa5df8e7))



## [1.0.1](https://github.com/TriPSs/nx-extend/compare/actions-run-many@1.0.0...actions-run-many@1.0.1) (2022-09-14)
