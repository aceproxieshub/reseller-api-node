# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2026-08-24

### Added

- Optional product and service type filtering through `ProductType`.
- Service `type` fields on list and detail responses, with `serviceType` retained as a compatibility alias.
- Complete IP replacement and residential service API coverage
- Runtime validation for inputs and successful API response shapes
- Dedicated validation, API, transport, and invalid-response errors
- GET-only retry handling with timeouts, bounded backoff, and `Retry-After` support
- Node compatibility, mutation, staging, dependency update, security, and release tooling

### Changed

- Prepared the package as the breaking 1.0 contract using PHP-aligned operation names
- Required a nonblank reseller token and corrected all request and response types to the current API
- Moved `dotenv` to development dependencies so the published client has no runtime dependencies

## [0.4.0] - 2026-04-19

### Added

- `services.addAuthWhitelistedIp()` resource implementation with tests and usage example
- `services.deleteAuthWhitelistedIp()` resource implementation with tests and usage example
- `services.requestProlongation()` resource implementation with tests and usage example
- `services.getAuthWhitelistedIps()` resource implementation with tests and usage example
- `services.updateAuthCredentials()` resource implementation with tests and usage example
- `services.getAuthCredentials()` resource implementation with tests and usage example
- `services.getProlongations()` resource implementation with tests and usage example
- `services.update()` resource implementation with tests and usage example

## [0.3.1] - 2026-04-09

### Changed

- Updated README to provide a correct project name in the installation section

## [0.3.0] - 2026-04-08

### Added

- `version.get()` resource implementation with tests and usage example
- `services.getProxyList()` resource implementation with tests and usage example
- `services.getBandwidth()` resource implementation with tests and usage example

## [0.2.0] - 2026-04-08

### Added

- `services.get()` resource implementation with tests and usage example
- `services.list()` resource implementation with tests and usage example
- `orders.get()` resource implementation with tests and usage example
- `orders.list()` resource implementation with tests and usage example
- `orders.create()` resource implementation with tests and usage example

### Changed

- Refined the README to provide a more professional package overview, clearer onboarding, and structured example and development guidance

## [0.1.0] - 2026-04-08

### Added

- `balance.get()` resource implementation with tests and usage example
- `products.list()` resource implementation with tests and usage example
- `products.getTypes()` resource implementation with tests and usage example

### Changed

- Pinned TypeScript to `5.5.4` to match the supported range for the current `@typescript-eslint` toolchain and remove the compatibility warning

## [0.0.1] - 2026-04-07

### Added

- Initial TypeScript ESM client scaffold for the Aceproxies reseller API
- Core HTTP client with bearer token support and API error handling
- `health.check()` resource implementation with automated test coverage
- Project tooling for build, lint, format, typecheck, and test workflows
