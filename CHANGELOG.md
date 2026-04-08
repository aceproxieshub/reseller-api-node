# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- `version.get()` resource implementation with tests and usage example.
- `services.getProxyList()` resource implementation with tests and usage example.
- `services.getBandwidth()` resource implementation with tests and usage example.

## [0.2.0] - 2026-04-08

### Added

- `services.get()` resource implementation with tests and usage example.
- `services.list()` resource implementation with tests and usage example.
- `orders.get()` resource implementation with tests and usage example.
- `orders.list()` resource implementation with tests and usage example.
- `orders.create()` resource implementation with tests and usage example.

### Changed

- Refined the README to provide a more professional package overview, clearer onboarding, and structured example and development guidance.

## [0.1.0] - 2026-04-08

### Added

- `balance.get()` resource implementation with tests and usage example.
- `products.list()` resource implementation with tests and usage example.
- `products.getTypes()` resource implementation with tests and usage example.

### Changed

- Pinned TypeScript to `5.5.4` to match the supported range for the current `@typescript-eslint` toolchain and remove the compatibility warning.

## [0.0.1] - 2026-04-07

### Added

- Initial TypeScript ESM client scaffold for the Aceproxies reseller API.
- Core HTTP client with bearer token support and API error handling.
- `health.check()` resource implementation with automated test coverage.
- Project tooling for build, lint, format, typecheck, and test workflows.
