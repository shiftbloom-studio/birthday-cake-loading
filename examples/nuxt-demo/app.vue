<script setup lang="ts">
import { useCakeFeatures, useCakeTier } from "@birthday-cake-loading/nuxt/runtime";

const tier = useCakeTier();
const features = useCakeFeatures();
</script>

<template>
  <main style="font-family: system-ui; padding: 24px; max-width: 720px; margin: 0 auto;">
    <h1>Birthday-Cake Loading — Nuxt demo</h1>
    <p>
      Tier: <strong>{{ tier }}</strong>
    </p>
    <ul>
      <li>motion: {{ String(features.motion) }}</li>
      <li>audio: {{ String(features.audio) }}</li>
      <li>richImages: {{ String(features.richImages) }}</li>
    </ul>

    <p style="opacity: 0.75;">
      Tip: inspect <code>&lt;html data-bcl-*&gt;</code> attributes in DevTools.
    </p>
  </main>
</template>

