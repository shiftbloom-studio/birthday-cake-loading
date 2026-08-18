# Contributing

Thanks for helping improve **@shiftbloom-studio/birthday-cake-loading**!

## First evening

You do not need to be good. Finish the small thing. English or German is fine.

Clone the repo, install the library, and run the Next.js demo:

```bash
git clone https://github.com/shiftbloom-studio/birthday-cake-loading.git
cd birthday-cake-loading
npm install
```

```bash
cd examples/next-demo
npm install
npm run dev
```

Docs live in the repo (not on the stub GitHub wiki Home):

- [README.md](./README.md) — quickstart and the [CakeWatch recipe](./docs/recipe-cakewatch.md)
- [WIKI.md](./WIKI.md) — architecture and API
- [docs/](./docs/) — short recipes
- [examples/next-demo/README.md](./examples/next-demo/README.md) — demo notes

Pick a `good first issue`, comment that you want it, then open a focused PR.

Start here: https://github.com/shiftbloom-studio/birthday-cake-loading/issues/41

## Local development

```bash
npm install
npm test
npm run build
```

### Watch mode

```bash
npm run dev
```

> `dev` runs `tsup --watch`. If you’re working on Next.js (App Router), also run a build once so the `dist/` output exists.

## Adding a changeset (required for releases)

```bash
npm run changeset
```

This creates a file in `.changeset/` describing your change and the semver bump.

## Pull requests

- Keep changes focused and documented.
- Add tests for new behavior when possible.
- Make sure these pass:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
