# Contributing

Thanks for helping improve **@birthday-cake/loading**!

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

