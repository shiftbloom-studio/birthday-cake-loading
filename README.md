# birthday-cake-loading

Birthday‑Cake Loading (BCL) is a capability‑adaptive progressive enhancement toolkit. It ships a tiny baseline runtime, detects device/network/user‑preference signals, and lazily upgrades experiences only when the runtime has enough budget.

**Baseline first:** your content should be correct and usable without animation, smooth scrolling, audio, or heavy UI libraries.

## Why BCL?

- **Fast time‑to‑content:** base tier stays lean and JS‑light.
- **Conservative detection:** missing signals never penalize; strong signals downgrade.
- **Accessible by default:** respects `prefers-reduced-motion`, `prefers-reduced-data`, and Save‑Data.
- **SSR bootstrap ready:** can compute an initial tier from **Client Hints** headers when available.
- **Framework adapters:** Nuxt, SvelteKit, Astro, Remix, Angular SSR.

## Quickstart

```bash
npm install birthday-cake-loading
```

```tsx
"use client"; 

import {
  CakeProvider,
  CakeLayer,
  CakeUpgrade,
  useCakeFeatures,
  useCakeTier
} from "birthday-cake-loading";

const MotionLayer = () => {
  const { motion } = useCakeFeatures();
  return <div>Motion enabled: {String(motion)}</div>;
};

export default function Page() {
  return (
    <CakeProvider>
      <main>
        <h1>Marketing Landing</h1>
        <CakeLayer minTier="rich" fallback={<div>Static hero</div>}>
          <div>Animated hero</div>
        </CakeLayer>
        <CakeUpgrade
          minTier="rich"
          strategy="idle"
          loader={() => import("./rich-gallery")}
          fallback={<div>Static gallery</div>}
        />
        <MotionLayer />
      </main>
    </CakeProvider>
  );
}
```

## Architecture overview

1. **Signals** — read best‑effort device/network/user‑preference signals (connection, memory, cores, reduced‑motion).
2. **Tiering** — map signals into `base | lite | rich | ultra` with conservative downgrade rules.
3. **Features** — derive feature flags from tier + signals.
4. **Layers** — gate and lazy‑load enhancements using `CakeLayer`, `CakeLazy`, or `CakeUpgrade`.

## Framework integrations (minimal setup)

- **Nuxt (Vue)**: [`docs/nuxt.md`](docs/nuxt.md) (`@birthday-cake-loading/nuxt`)
- **SvelteKit (Svelte)**: [`docs/sveltekit.md`](docs/sveltekit.md) (`@birthday-cake-loading/sveltekit`)
- **Astro (multi-framework)**: [`docs/astro.md`](docs/astro.md) (`@birthday-cake-loading/astro`)
- **Remix (React)**: [`docs/remix.md`](docs/remix.md) (`@birthday-cake-loading/remix`)
- **Angular (Universal/SSR)**: [`docs/angular.md`](docs/angular.md) (`@birthday-cake-loading/angular`)

## Heavy library optimizations

Tier-aware wrappers live in [`docs/optimize.md`](docs/optimize.md) (`@birthday-cake-loading/optimize`).

## API

### `CakeProvider`

```tsx
<CakeProvider
  config={{
    tiering: { lowMemoryGB: 4 },
    features: { allowMotionOnLite: false }
  }}
  // SSR/first paint hint (NOT a persistent override)
  initialTier="base"
  autoDetect={true}
  onChange={(state) => console.log(state)}
>
  {children}
</CakeProvider>
```

- `config`: override tier + feature heuristics.
- `bootstrap`: `{ signals, tier }` from the server (see `getServerCakeBootstrapFromHeaders` below).
- `initialTier`: useful for SSR/initial paint (it will re‑detect on mount by default).
- `autoDetect`: set `false` for fully manual control (or tests).
- `onChange`: subscribe to tier changes.

### Hooks

- `useCake()` → full state `{ tier, features, signals, ready }`.
- `useCakeTier()` → current tier.
- `useCakeFeatures()` → feature flags.
- `useCakeSignals()` → raw signals.
- `useCakeReady()` → ready flag (signals captured).

### Gating components

```tsx
<CakeLayer minTier="rich" fallback={<BaseHero />}>
  <RichHero />
</CakeLayer>
```

```tsx
<CakeLazy
  feature="motion"
  loader={() => import("./AnimatedLayer")}
  fallback={<BaseHero />}
/>
```

`CakeUpgrade` is like `CakeLazy`, but also lets you pick *when* to upgrade:

```tsx
import { CakeUpgrade } from "birthday-cake-loading/upgrade";

<CakeUpgrade
  minTier="rich"
  strategy={{ type: "visible", rootMargin: "200px" }}
  loader={() => import("./RichSection")}
  fallback={<BaseSection />}
/>;
```

### Server helpers

```ts
import { getServerCakeBootstrapFromHeaders } from "birthday-cake-loading/server";

const bootstrap = getServerCakeBootstrapFromHeaders(headers);
```

If you want baseline-first SSR by default, use:

```ts
import { getServerCakeBootstrapFromHeadersIfPresent } from "birthday-cake-loading/server";
```

Pass that into the provider (e.g. Next.js App Router):

```tsx
// app/layout.tsx (server)
import { headers } from "next/headers";
import { getServerCakeBootstrapFromHeaders } from "birthday-cake-loading/server";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = getServerCakeBootstrapFromHeaders(headers());
  return (
    <html lang="en">
      <body>
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
```

## Debugging & overrides

BCL writes attributes on `<html>`:

- `data-bcl-tier`
- `data-bcl-ready`
- `data-bcl-motion`
- `data-bcl-smooth-scroll`
- `data-bcl-audio`
- `data-bcl-privacy`
- `data-bcl-rich-images`
- `data-bcl-save-data`
- `data-bcl-override` (when set)
- `data-bcl-ect` (effective connection type, when available)

Force a tier for the current session:

```ts
import { setTierOverride } from "birthday-cake-loading";

setTierOverride("base");
```

You can also mount an in-app dev panel:

```tsx
import { CakeDevTools } from "birthday-cake-loading/devtools";

<CakeDevTools />;
```

## Example (Next.js App Router)

See `examples/next-demo` for a minimal demo showcasing tiered content and lazy enhancements.

## More examples

- Nuxt: `examples/nuxt-demo`
- SvelteKit: `examples/sveltekit-demo`
- Astro: `examples/astro-demo`
- Remix / Angular: see wiring references in `examples/*`

### Deploy the demo on Vercel

- **Root Directory**: `examples/next-demo`
- The demo includes a `middleware.ts` that sets `Accept-CH` + `Permissions-Policy` so browsers can send **Client Hints** (improves server bootstrap via `birthday-cake-loading/server`).

## Testing

```bash
npm test
```

## License

GPL-3.0
