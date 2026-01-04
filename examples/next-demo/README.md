# Birthday-Cake Loading — Next.js Demo (Vercel-ready)

This is a Next.js App Router demo for [`@shiftbloom-studio/birthday-cake-loading`](https://www.npmjs.com/package/@shiftbloom-studio/birthday-cake-loading) that shows:

- **SSR bootstrap** via `@shiftbloom-studio/birthday-cake-loading/server` + Next.js `headers()`
- **Tier-gated rendering** with `CakeLayer` (`base → lite → rich → ultra`)
- **Deferred upgrades** with `CakeUpgrade` (`idle`, `visible`, `interaction`, `timeout`)
- **Watchtower** (`CakeWatch`) that downgrades watched layers during jank
- **DevTools** overlay for quickly overriding tiers during demos/QA

## Run locally

```bash
npm install
npm run dev
```

### Demo tips

- Open the **BCL DevTools** (top-right) to override tiers and inspect live signals/features.
- Click **Simulate jank** to trigger a long task — watched layers will temporarily swap back to their fallbacks.

## Deploy to Vercel

- **Root Directory**: `examples/next-demo`
- **Framework Preset**: Next.js (auto-detected)

## Client Hints (important)

This demo requests Client Hints via `proxy.ts` so `@shiftbloom-studio/birthday-cake-loading/server` can compute a better SSR bootstrap from request headers over time.

Some hints only appear on a subsequent navigation/refresh after the browser sees the `Accept-CH` response header.

> Note: This demo installs `@shiftbloom-studio/birthday-cake-loading` from npm. If you want to test local unpublished changes, install a packed tarball from your working tree or publish a prerelease.
