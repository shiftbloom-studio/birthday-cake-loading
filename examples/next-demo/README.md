# Birthday-Cake Loading - Next.js Demo

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
- Click **Simulate jank** to trigger a long task - watched layers will temporarily swap back to their fallbacks.

## Deploy to Cloudflare Workers

The demo runs on Cloudflare Workers through [vinext](https://github.com/cloudflare/vinext), which builds the same `app/` directory with Vite. `next dev` and `next build` keep working for plain Next.js.

```bash
npm run dev:vinext     # local dev server in the Workers runtime
npm run build:vinext   # production build
npm run start:vinext   # preview the built Worker locally
npm run deploy         # build and deploy with the cf CLI
```

Worker settings live in `cloudflare.config.ts`; installation-specific values come from environment variables, so nothing account-specific is committed. With [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), connect the repository and use:

| Setting | Value |
| --- | --- |
| Root directory | `examples/next-demo` |
| Build command | `npm ci` |
| Deploy command | `npm run deploy` |
| Build variables | see `.env.example` |

### Imprint and privacy policy

The demo serves an imprint and a privacy policy in English and German at `/imprint`, `/impressum`, `/privacy` and `/datenschutz`. The operator details are read from the `OPERATOR_*` variables at build time (see `.env.example`), so the repository holds no personal data. If you run your own copy, set your own details and review the privacy policy against what your deployment actually does.

## Client Hints (important)

This demo requests Client Hints via `proxy.ts` so `@shiftbloom-studio/birthday-cake-loading/server` can compute a better SSR bootstrap from request headers over time.

Some hints only appear on a subsequent navigation/refresh after the browser sees the `Accept-CH` response header.

> Note: This demo installs `@shiftbloom-studio/birthday-cake-loading` from npm. If you want to test local unpublished changes, install a packed tarball from your working tree or publish a prerelease.
