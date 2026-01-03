# Astro — `@birthday-cake-loading/astro`

## Install

```bash
npm i @birthday-cake-loading/astro
```

## Setup

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import birthdayCakeLoading from "@birthday-cake-loading/astro";

export default defineConfig({
  integrations: [birthdayCakeLoading()]
});
```

The integration adds middleware that:

- sets Client Hints headers (Accept-CH / Permissions-Policy / Vary)
- computes `Astro.locals.bcl.bootstrap` when hints are present (baseline-first)

## Passing bootstrap to islands

```astro
---
import CakeBootstrap from "@birthday-cake-loading/astro/components/CakeBootstrap.astro";
import App from "../components/App.tsx";
---

<CakeBootstrap>
  {(bootstrap) => <App client:load bootstrap={bootstrap} />}
</CakeBootstrap>
```
