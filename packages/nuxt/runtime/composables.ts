import { computed } from "vue";
import { useNuxtApp } from "#app";
import type { CakeFeatures, CakeSignals, CakeTier } from "@birthday-cake-loading/core";

type BclApi = {
  state: {
    value: {
      tier: CakeTier;
      features: CakeFeatures;
      signals: CakeSignals;
      ready: boolean;
      override?: CakeTier;
    };
  };
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
};

const useBcl = (): BclApi => {
  const nuxtApp = useNuxtApp();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = (nuxtApp as any).$bcl as BclApi | undefined;
  if (!api) {
    throw new Error("[birthday-cake-loading] Nuxt plugin not installed. Add '@birthday-cake-loading/nuxt' to nuxt.config modules.");
  }
  return api;
};

export const useCake = () => useBcl().state;
export const useCakeTier = () => computed(() => useBcl().state.value.tier);
export const useCakeFeatures = () => computed(() => useBcl().state.value.features);
export const useCakeSignals = () => computed(() => useBcl().state.value.signals);
export const useCakeReady = () => computed(() => useBcl().state.value.ready);

