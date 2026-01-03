# Birthday-Cake Loading — Next.js Demo (Vercel-ready)

This is a minimal Next.js App Router demo for [`birthday-cake-loading`](https://www.npmjs.com/package/birthday-cake-loading).

## Deploy to Vercel

- **Root Directory**: set to `examples/next-demo`
- **Framework Preset**: Next.js (auto-detected)

The demo requests **Client Hints** via `middleware.ts` so `birthday-cake-loading/server` can compute a better SSR bootstrap from request headers over time.

## Run locally

```bash
npm install
npm run dev
```

> Note: This demo installs `birthday-cake-loading` from npm. If you want to test local unpublished changes, publish a prerelease or install a packed tarball from your working tree.

