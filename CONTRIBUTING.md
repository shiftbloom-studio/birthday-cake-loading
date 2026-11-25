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

- [README.md](./README.md) - quickstart and the [CakeWatch recipe](./docs/recipe-cakewatch.md)
- [WIKI.md](./WIKI.md) - architecture and API
- [docs/](./docs/) - short recipes
- [examples/next-demo/README.md](./examples/next-demo/README.md) - demo notes

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

## Working on an issue

Issues labeled `good first issue` or `help wanted` are open to anyone. Before you write code:

1. Comment on the issue and say how you plan to approach it: the files you expect to touch, and anything you would do differently from what the issue suggests. A few sentences are enough.
2. Wait until a maintainer assigns the issue to you. That way two people don't build the same thing, and we can point out a dead end before you spend an evening on it.
3. Open the pull request and link the issue (`Closes #123`).

Typo fixes and other small, obvious changes can go straight to a pull request.

If an assigned issue sees no activity for 14 days, we'll check in and may hand it to someone else. You're welcome to pick it up again later.

## Using AI tools

You're welcome to use AI assistants, the same way you'd use an editor or a linter. We only ask that a person stands behind every contribution:

- You have read and understood every line you submit, and you ran the checks yourself.
- You answer review questions in your own words and can change the code when we ask.
- The pull request description explains what you decided and why. The diff already shows what changed.

Issues, comments and pull requests that an agent wrote and posted on its own, with nobody actually involved, will be closed. This isn't about the tool. We'd like to get to know the people who work on this project.
