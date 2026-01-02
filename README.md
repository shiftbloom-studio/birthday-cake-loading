# @birthday-cake-loading

Birthday‑Cake Loading (BCL) is a capability‑adaptive progressive enhancement toolkit for React and Next.js. It ships a tiny baseline runtime, detects device/network/user‑preference signals, and lazily upgrades experiences only when the runtime has enough budget.

> **Baseline first:** your content should be correct and usable without animation, smooth scrolling, or audio.

## Why BCL?

- **Fast time‑to‑content:** base tier stays lean and JS‑light.
- **Conservative detection:** missing signals never penalize; strong signals downgrade.
- **Accessible by default:** respects `prefers-reduced-motion`, `prefers-reduced-data`, and Save‑Data.
- **Next.js ready:** works with the App Router + client components.

## Quickstart

```bash
npm install @birthday-cake-loading
```

```tsx
"use client";

import {
  CakeProvider,
  CakeLayer,
  CakeUpgrade,
  useCakeFeatures,
  useCakeTier
} from "@birthday-cake-loading";

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
import { CakeUpgrade } from "@birthday-cake-loading/upgrade";

<CakeUpgrade
  minTier="rich"
  strategy={{ type: "visible", rootMargin: "200px" }}
  loader={() => import("./RichSection")}
  fallback={<BaseSection />}
/>;
```

### Server helpers

```ts
import { getServerCakeBootstrapFromHeaders } from "@birthday-cake-loading/server";

const bootstrap = getServerCakeBootstrapFromHeaders(headers);
```

Pass that into the provider (e.g. Next.js App Router):

```tsx
// app/layout.tsx (server)
import { headers } from "next/headers";
import { getServerCakeBootstrapFromHeaders } from "@birthday-cake-loading/server";
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
import { setTierOverride } from "@birthday-cake-loading";

setTierOverride("base");
```

You can also mount an in-app dev panel:

```tsx
import { CakeDevTools } from "@birthday-cake-loading/devtools";

<CakeDevTools />;
```

## Example (Next.js App Router)

See `examples/next-demo` for a minimal demo showcasing tiered content and lazy enhancements.

## Testing

```bash
npm test
```

## License

MIT
