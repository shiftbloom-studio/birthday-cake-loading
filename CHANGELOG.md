# @shiftbloom-studio/birthday-cake-loading

## 0.3.3

### Patch Changes

- Align the repository metadata with the Apache-2.0 license and refresh the published package metadata.

## 0.3.2

### Patch Changes

- Switch npm publishing to GitHub Actions trusted publishing and refresh the package release metadata.

## 0.3.1

### Patch Changes

- Refresh repository dependencies and update the Next.js demo app to `next@16.2.1`.

  This release contains maintenance-only changes since 2026-01-16, including refreshed lockfiles
  and development dependency updates. No public API changes are included.

## 0.3.0

### Minor Changes

- Enhance type safety, testing infrastructure, and demo capabilities:

  - **Type Safety**: Add type assertions in upgrade.tsx to resolve TypeScript linting errors and improve type checking
  - **Testing**: Add comprehensive unit tests for Watchtower jank detection and browser compatibility signals, improve test mocks with jest.spyOn, add global PerformanceObserver and RAF mocks to test setup
  - **Demo Enhancements**: Add server snapshot component, interaction preview upgrades, rich metrics, ultra celebration effects, and visible gallery components to next-demo
  - **Code Quality**: Configure ESLint for underscore-prefixed parameters, fix z-index stacking issues with CSS variables, improve watchtower test maintainability
  - **CI/CD**: Add Semgrep security scanning, fix GitHub Actions permissions
  - **Dependencies**: Add TypeScript and related type definitions as dev dependencies
  - **Style**: Add demo warning comments and improve number formatting

## 0.2.8

### Patch Changes

- bc4dd37: Refactor core logic (signal-matrix, server), improve type safety (Window interface), and add comprehensive tests.

## 0.2.6

### Patch Changes

- e57c51b: Add the opt-in CakeWatchtower runtime jank guard with watch-key targeting and fallback swaps.

## 0.2.5

### Patch Changes

- Add the opt-in CakeWatchtower runtime jank guard with watch-key targeting and fallback swaps.

## 0.2.4

### Patch Changes

- a9131e1: Add an optional, config-gated Signal Matrix with coarse privacy-safe rules and override support for tier adjustments.

## 0.2.0

### Minor Changes

- Add `CakeUpgrade` (strategy-based progressive enhancement), SSR bootstrap helpers, DevTools overlay, stronger signal watching, improved exports, and expanded tests.
- Harden server header parsing (supports Next.js `headers()` objects, parses reduced-data + viewport height), make tier overrides resilient to storage errors, add repo lint config + CI checks, and ship a Vercel-ready Next.js demo.

### Patch Changes

- 0be4247: Update README with improved documentation, usage examples, and package name corrections.

## 0.1.2

### Patch Changes

- 0be4247: Update README with improved documentation, usage examples, and package name corrections.

## 0.1.1

### Patch Changes

- Update README with improved documentation, usage examples, and package name corrections.
