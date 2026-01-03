# Nuxt (Vue) — `@birthday-cake-loading/nuxt`

## Install

```bash
npm i @birthday-cake-loading/nuxt
```

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@birthday-cake-loading/nuxt"],
  birthdayCakeLoading: {
    clientHints: true,
    applyHtmlDataset: true
  }
});
```

## Use

```vue
<script setup lang="ts">
import { useCakeTier, useCakeFeatures } from "@birthday-cake-loading/nuxt/runtime";
const tier = useCakeTier();
const features = useCakeFeatures();
</script>

<template>
  <p>Tier: {{ tier }}</p>
  <p>Motion: {{ String(features.motion) }}</p>
</template>
```
