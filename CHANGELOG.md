# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
