# Birthday-Cake Loading (BCL) Repository Wiki

Comprehensive reference for the `@shiftbloom-studio/birthday-cake-loading` monorepo: architecture, public API, internals, scripts, and examples.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Concepts](#core-concepts)
- [Architecture & Data Flow](#architecture--data-flow)
- [Repository Layout](#repository-layout)
- [Packages & Entry Points](#packages--entry-points)
- [Public API Reference](#public-api-reference)
  - [Provider & Hooks](#provider--hooks)
  - [Layering Components](#layering-components)
  - [Upgrade Strategy](#upgrade-strategy)
  - [Server Helpers](#server-helpers)
  - [Overrides & Debugging](#overrides--debugging)
  - [DevTools](#devtools)
- [Configuration](#configuration)
- [Signals & Tiering](#signals--tiering)
- [Features](#features)
- [HTML Data Attributes](#html-data-attributes)
- [Examples](#examples)
- [Testing](#testing)
- [Build & Tooling](#build--tooling)
- [Release Process](#release-process)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Project Overview

Birthday‑Cake Loading (BCL) is a capability‑adaptive progressive enhancement toolkit for React and Next.js. It ships a tiny baseline runtime, detects device/network/user‑preference signals, and upgrades experiences only when there is enough budget. The core idea is **baseline-first**: content should be correct and usable without animation, smooth scrolling, or audio.

Primary goals:

- Fast time‑to‑content by keeping the base tier lean.
- Conservative detection with safety‑first downgrades.
- Accessibility defaults (`prefers-reduced-motion`, `prefers-reduced-data`, `save-data`).
- First‑class Next.js App Router support.

## Core Concepts

- **Signals**: Best‑effort device/network/user signals derived from browser APIs or headers.
- **Tier**: A derived capability bucket (`base | lite | rich | ultra`).
- **Features**: Concrete capabilities derived from tier + signals (motion, smooth scrolling, audio, etc.).
- **Layers**: Declarative gates for enabling enhancements based on tier or features.
- **Upgrades**: Lazy‑load enhancements at the right time (idle/visibility/interaction/timeout).

## Architecture & Data Flow

1. **Signals** are detected on the client or inferred on the server (client hints).
2. **Tiering** turns signals into a tier with conservative downgrade rules.
3. **Features** map tier + signals to capability flags.
4. **Layering/Upgrading** gates content and loads enhancements when allowed.
5. **Overrides** (optional) allow a runtime session override for testing or demos.

```
Signals → Tier → Features → Layer/Upgrade gating
```

## Repository Layout

```
.
├── src/                  # Library source
│   ├── config.ts         # Default config values
│   ├── context.tsx        # CakeProvider + hooks
│   ├── devtools.tsx       # In‑app dev panel
│   ├── features.ts        # Feature derivation
│   ├── layer.tsx          # CakeLayer/CakeLazy gating
│   ├── override.ts        # Session override storage
│   ├── server.ts          # Server/client hints helpers
│   ├── signals.ts         # Signal detection + subscriptions
│   ├── tier.ts            # Tier derivation
│   ├── types.ts           # Shared type definitions
│   └── upgrade.tsx        # CakeUpgrade component
├── examples/next-demo/    # Next.js App Router demo
├── tests/                 # Jest test suite
├── scripts/               # Build helpers
├── tsup.config.ts         # Build configuration
├── package.json           # Package metadata + scripts
├── README.md              # Quickstart and API overview
├── CONTRIBUTING.md        # Development + contribution guide
├── CHANGELOG.md           # Release notes
└── SECURITY.md            # Security policy
```

## Packages & Entry Points

The package is published as a single npm package with multiple entry points.

- `@shiftbloom-studio/birthday-cake-loading` → main runtime and React components (`src/index.ts`)
- `@shiftbloom-studio/birthday-cake-loading/server` → server/client-hints helpers (`src/server.ts`)
- `@shiftbloom-studio/birthday-cake-loading/upgrade` → `CakeUpgrade` component (`src/upgrade.tsx`)
- `@shiftbloom-studio/birthday-cake-loading/devtools` → `CakeDevTools` panel (`src/devtools.tsx`)

Build output is generated via `tsup` into `dist/` (ESM + CJS + types).

## Public API Reference

### Provider & Hooks

**`<CakeProvider>`** (`src/context.tsx`)

- Provides tiering state via React context.
- Automatically detects signals and updates state (unless `autoDetect` is false).
- Accepts an optional server bootstrap for SSR consistency.

Key props:

- `config?: Partial<CakeConfig>`
- `bootstrap?: CakeBootstrap`
- `initialSignals?: CakeSignals`
- `initialTier?: CakeTier`
- `autoDetect?: boolean`
- `onChange?: (state: CakeState) => void`

**Hooks**

- `useCake()` → full state `{ tier, features, signals, ready, override }`
- `useCakeTier()` → current tier
- `useCakeFeatures()` → feature flags
- `useCakeSignals()` → raw signals
- `useCakeReady()` → ready flag

### Layering Components

**`<CakeLayer>`** (`src/layer.tsx`)

- Gates render based on minimum tier or a feature flag.
- Renders `fallback` when not allowed or until ready.

Props:

- `minTier?: CakeTier` (default: `"rich"`)
- `feature?: CakeFeatureKey`
- `fallback?: React.ReactNode`
- `children: React.ReactNode`

**`<CakeLazy>`** (`src/layer.tsx`)

- Like `CakeLayer`, but lazy‑loads a component when allowed.

Props:

- `loader: () => Promise<{ default: React.ComponentType<P> }>`
- `props?: P` for the lazy component
- `minTier`, `feature`, `fallback` same as `CakeLayer`

### Upgrade Strategy

**`<CakeUpgrade>`** (`src/upgrade.tsx`)

- Lazy‑loads a component, but also controls *when* to upgrade.
- Strategies: `"immediate"`, `"idle"`, `"visible"`, `"interaction"`, or timeout/idle/visible objects.

Props:

- `strategy?: CakeUpgradeStrategy` (default: `"idle"`)
- `containerAs?: "div" | "span" | ...`
- `containerProps?: React.HTMLAttributes<HTMLElement>`

Useful when you need baseline content immediately, then upgrade only after idle, visibility, or user interaction.

### Server Helpers

From `@shiftbloom-studio/birthday-cake-loading/server` (`src/server.ts`):

- `getServerSignalsFromHeaders(headers)`
- `getServerTier(signals, config?)`
- `getServerFeatures(tier, signals, config?)`
- `getServerCakeBootstrapFromHeaders(headers, config?)`

Designed for Next.js App Router + Client Hints to produce `bootstrap` for `<CakeProvider>`.

### Overrides & Debugging

From `src/override.ts` and `src/context.tsx`:

- `setTierOverride(tier?)` / `getTierOverride()`
- `CAKE_TIER_OVERRIDE_KEY = "bcl_tier_override"`
- Overrides are stored in `sessionStorage` and take effect on the next refresh.

### DevTools

From `@shiftbloom-studio/birthday-cake-loading/devtools` (`src/devtools.tsx`):

- `<CakeDevTools>` provides a floating panel for viewing signals, features, and tier.
- Supports runtime tier override and refresh.
- Props:
  - `initiallyOpen?: boolean`
  - `position?: "bottom-left" | "bottom-right" | "top-left" | "top-right"`

## Configuration

Default configuration lives in `src/config.ts` as `DEFAULT_CONFIG`.

```ts
const DEFAULT_CONFIG = {
  tiering: {
    lowMemoryGB: 4,
    veryLowMemoryGB: 2,
    lowCpuCores: 4,
    ultraMemoryGB: 8,
    ultraCpuCores: 8,
    minDownlinkMbps: 1.5,
    maxRttMs: 300
  },
  features: {
    allowMotionOnLite: false,
    allowRichImagesOnBase: false,
    audioRequiresUnmetered: true
  },
  debug: false,
  watchSignals: true
};
```

Config is merged into defaults in `CakeProvider` to ensure full coverage.

## Signals & Tiering

Signal collection (`src/signals.ts`) includes:

- `saveData`, `effectiveType`, `downlinkMbps`, `rttMs`
- `deviceMemoryGB`, `hardwareConcurrency`
- `devicePixelRatio`, `screenWidth`, `screenHeight`
- `prefersReducedMotion`, `prefersReducedData`
- `userAgentMobile`

Tiering (`src/tier.ts`) rules:

- **base**: save‑data / prefers‑reduced‑data, very low memory, or 2G.
- **lite**: low memory/cores, 3G, or constrained network.
- **ultra**: high memory + cores and not save‑data.
- **rich**: default when above constraints but not ultra.

## Features

Feature derivation (`src/features.ts`) builds flags from tier + signals:

- `motion` / `smoothScroll`: allowed on `rich` or optional on `lite`, disabled if reduced motion.
- `audio`: allowed on `rich` with non‑constrained network and no reduced motion/data.
- `privacyBanner`: allowed on `rich` when not save‑data.
- `richImages`: allowed on `lite` or optionally on `base`.

## HTML Data Attributes

`CakeProvider` writes attributes onto `<html>` for debugging and CSS hooks:

- `data-bcl-tier`
- `data-bcl-ready`
- `data-bcl-motion`
- `data-bcl-smooth-scroll`
- `data-bcl-audio`
- `data-bcl-privacy`
- `data-bcl-rich-images`
- `data-bcl-save-data`
- `data-bcl-override` (when set)
- `data-bcl-ect` (effective connection type)

## Examples

**Next.js demo** (`examples/next-demo/`):

- App Router demo with `middleware.ts` to send Client Hints.
- Local dev: `npm install` + `npm run dev` in that directory.
- Vercel root directory should be `examples/next-demo`.

## Testing

The test suite lives in `tests/` and runs with Jest (`jest.config.cjs`).

Common commands:

- `npm test`
- `npm run test:ci`
- `npm run test:watch`

## Build & Tooling

- **Build**: `npm run build` invokes `scripts/build.mjs` → `tsup` + `scripts/ensure-use-client.mjs`.
- **Dev watch**: `npm run dev` runs `tsup --watch`.
- **Typecheck**: `npm run typecheck` (tsc no emit).
- **Lint**: `npm run lint` (eslint).

### Build system details

`tsup.config.ts` builds ESM/CJS + types for:

- `src/index.ts` (main runtime)
- `src/upgrade.tsx` (`/upgrade` entry)
- `src/devtools.tsx` (`/devtools` entry)
- `src/server.ts` (`/server` entry)

`ensure-use-client.mjs` prepends the `"use client"` directive to client‑side entry outputs to ensure compatibility with Next.js App Router.

## Release Process

- Versioning and publishing are managed via **Changesets** (`.changeset/`).
- Commands:
  - `npm run changeset` → create a changeset
  - `npm run version` → apply changeset version bumps
  - `npm run release` → publish

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup and expectations.

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy.

## License

GPL‑3.0 — see [LICENSE](./LICENSE).
