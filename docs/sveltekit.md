# SvelteKit — `@birthday-cake-loading/sveltekit`

## Install

```bash
npm i @birthday-cake-loading/sveltekit
```

## Setup

```ts
// src/hooks.server.ts
import { handleBirthdayCakeLoading } from "@birthday-cake-loading/sveltekit/server";
export const handle = handleBirthdayCakeLoading();
```

```ts
// src/routes/+layout.server.ts
export const load = ({ locals }) => ({ bootstrap: locals.bcl?.bootstrap });
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { CakeProvider } from "@birthday-cake-loading/sveltekit";
  export let data;
</script>

<CakeProvider bootstrap={data.bootstrap}>
  <slot />
</CakeProvider>
```

## Use

```svelte
<script lang="ts">
  import { useCakeTier } from "@birthday-cake-loading/sveltekit";
  const tier = useCakeTier();
</script>

<p>Tier: {$tier}</p>
```
