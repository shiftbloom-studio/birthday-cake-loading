import { defineNuxtPlugin, useState } from "#app";
import { computed, shallowRef } from "vue";
import type { CakeBootstrap, CakeState, CakeTier } from "@birthday-cake-loading/core";
import { createCakeRuntime } from "@birthday-cake-loading/core/runtime";
import { applyCakeDatasetAttributes } from "@birthday-cake-loading/core/dom";
import { useRuntimeConfig } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  // Server middleware stores bootstrap on the request context.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverBootstrap = (nuxtApp.ssrContext as any)?.event?.context?.bclBootstrap as
    | CakeBootstrap
    | undefined;

  const bootstrapState = useState<CakeBootstrap | undefined>("bcl:bootstrap", () => serverBootstrap);

  const stateRef = shallowRef<CakeState>({
    signals: {},
    tier: "base",
    features: {
      motion: false,
      smoothScroll: false,
      audio: false,
      privacyBanner: false,
      richImages: false
    },
    ready: false
  });

  const runtime = createCakeRuntime({
    bootstrap: bootstrapState.value,
    autoDetect: true,
    onChange: (next) => {
      stateRef.value = next;
    }
  });

  // Keep state in sync initially.
  stateRef.value = runtime.getState();

  // Apply <html data-bcl-*> attributes on the client.
  const runtimeConfig = useRuntimeConfig();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyHtmlDataset = Boolean((runtimeConfig.public as any)?.birthdayCakeLoading?.applyHtmlDataset ?? true);
  if (process.client && applyHtmlDataset) {
    applyCakeDatasetAttributes(stateRef.value);
    runtime.subscribe((s) => applyCakeDatasetAttributes(s));
  }

  // Provide a small, readonly API for composables.
  const api = {
    state: computed(() => stateRef.value),
    refresh: () => runtime.refresh(),
    setTierOverride: (tier?: CakeTier) => runtime.setTierOverride(tier)
  };

  nuxtApp.provide("bcl", api);
});

