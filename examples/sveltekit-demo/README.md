# Birthday-Cake Loading — SvelteKit demo

Minimal SvelteKit demo for `@birthday-cake-loading/sveltekit`.

## Run

```bash
npm install
npm run dev
```

Key wiring:
- `src/hooks.server.ts` uses `handleBirthdayCakeLoading()` to set Client Hint headers and compute `locals.bcl.bootstrap`
- `src/routes/+layout.server.ts` passes `bootstrap` into the root layout
- `src/routes/+layout.svelte` wraps everything in `<CakeProvider bootstrap={...}>`

