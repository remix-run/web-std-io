# Changelog

## 4.4.0-pre.0

### Minor Changes

- 807fc63: Export CJS version for browser

### Patch Changes

- d3a1ffd: fix `toFormData` imports
- Updated dependencies [807fc63]
  - @remix-run/web-file@3.1.0-pre.0
  - @remix-run/web-form-data@3.1.0-pre.0
  - @remix-run/web-stream@1.1.0-pre.0

## 4.3.8

### Patch Changes

- 8ea9e6c: fetch called on non Window object

## 4.3.7

### Patch Changes

- Fix `headers.entries`/`values`/`forEach` iteration for `Set-Cookie` headers ([#39](https://github.com/remix-run/web-std-io/pull/39))
- Import `Buffer` from `"buffer"` instead of relying on a global `Buffer` ([#40](https://github.com/remix-run/web-std-io/pull/40))

## 4.3.6

### Patch Changes

- 5d1e12a: Remove socket listeners if request is aborted
- 43c6ce2: Move types conditional export to the top of the list to align with [the node guidance](https://nodejs.org/api/packages.html#community-conditions-definitions)
- Updated dependencies [43c6ce2]
  - @remix-run/web-blob@3.0.5
  - @remix-run/web-form-data@3.0.5
  - @remix-run/web-stream@1.0.4

## 4.3.5

### Patch Changes

- cf9ee6f: Submitted empty file inputs are now correctly parsed out as empty `File` instances instead of being surfaced as an empty string via `request.formData()`

## 4.3.4

### Patch Changes

- 7f91c87: fixes "ERR_INVALID_THIS" on Node 20

## 4.3.3

### Patch Changes

- Align with [spec](https://fetch.spec.whatwg.org/#methods) for `new Request()` `method` normalization ([#30](https://github.com/remix-run/web-std-io/pull/30))

  - Only `DELETE`, `GET`, `HEAD`, `OPTIONS`, `POST`, `PUT` get automatically uppercased
  - Note that `method: "patch"` will no longer be automatically uppercased
  - Throw a `TypeError` for `CONNECT`, `TRACE`, and `TRACK`

## 4.3.2

### Patch Changes

- 3b9b384: Memory leak caused by unregistered listeners. Solution was copied from a node-fetch pr.
- a85373d: Add support for custom "credentials" value. Nothing is done with them at the moment but they pass through for the consumer of the request to access if needed.

## 4.3.1

### Patch Changes

- eb54144: Make Request signal handling follow spec: https://fetch.spec.whatwg.org/#ref-for-map-exists%E2%91%A0%E2%91%A3

## 4.3.0

### Minor Changes

- 6d9cd44: expose RequestExtraOptions to fetch & add HTTPs.agent to types

### Patch Changes

- 908263e: allow clone of request and responses will null body

## 4.2.0

### Minor Changes

- a34cb39: Fixes redirects failing when response is chunked but empty. This is backported from https://github.com/node-fetch/node-fetch/pull/1222

### Patch Changes

- dcfcac4: Fix generated types to work with node ESM / NodeNext
- Updated dependencies [6521895]
  - @remix-run/web-form-data@3.0.3

## [4.1.0](https://www.github.com/web-std/io/compare/fetch-v4.0.1...fetch-v4.1.0) (2022-04-20)

### Features

- add support for application/x-www-form-urlencoded in request.formData() ([#60](https://www.github.com/web-std/io/issues/60)) ([c719b0d](https://www.github.com/web-std/io/commit/c719b0de442811eb588309b777ab6ab3d966cdf1))

## [4.0.1](https://www.github.com/web-std/io/compare/fetch-v4.0.0...fetch-v4.0.1) (2022-04-13)

### Bug Fixes

- **packages/fetch:** only export what's needed so TS doesn't mess up the imports in the output files ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))
- **packages/stream:** no initializers in ambient contexts ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))
- typescript types ([#56](https://www.github.com/web-std/io/issues/56)) ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))

## [4.0.0](https://www.github.com/web-std/io/compare/fetch-v3.0.3...fetch-v4.0.0) (2022-02-28)

### ⚠ BREAKING CHANGES

- export native fetch on the web (#53)

### Features

- export native fetch on the web ([#53](https://www.github.com/web-std/io/issues/53)) ([af03280](https://www.github.com/web-std/io/commit/af03280788286cd69185efb0572da162f16d48cc))
- implement file: protocol support for fetch ([#55](https://www.github.com/web-std/io/issues/55)) ([19d17c7](https://www.github.com/web-std/io/commit/19d17c76f995800c9e07d5d6a923f33b81ab1d22))

## [3.0.3](https://www.github.com/web-std/io/compare/fetch-v3.0.2...fetch-v3.0.3) (2022-01-28)

### Bug Fixes

- include dist/index.cjs in files ([#47](https://www.github.com/web-std/io/issues/47)) ([2a12474](https://www.github.com/web-std/io/commit/2a1247404650bf5b6662fa520248bf07ae457987))

## [3.0.2](https://www.github.com/web-std/io/compare/fetch-v3.0.1...fetch-v3.0.2) (2022-01-21)

### Changes

- bump fetch versions ([e8ae4e5](https://www.github.com/web-std/io/commit/e8ae4e5e61591f1bcbd45a0541c762468e134e4b))

## [3.0.1](https://www.github.com/web-std/io/compare/fetch-v3.0.0...fetch-v3.0.1) (2022-01-19)

### Bug Fixes

- ship less files to address TSC issues ([#35](https://www.github.com/web-std/io/issues/35)) ([0651e62](https://www.github.com/web-std/io/commit/0651e62ae42d17eae2db89858c9e44f3342c304c))

## 3.0.0 (2021-11-08)

### Features

- revamp the repo ([#19](https://www.github.com/web-std/io/issues/19)) ([90624cf](https://www.github.com/web-std/io/commit/90624cfd2d4253c2cbc316d092f26e77b5169f47))

### Changes

- align package versions ([09c8676](https://www.github.com/web-std/io/commit/09c8676348619313d9df24d9597cea0eb82704d2))
- bump versions ([#27](https://www.github.com/web-std/io/issues/27)) ([0fe5224](https://www.github.com/web-std/io/commit/0fe5224124e318f560dcfbd8a234d05367c9fbcb))
