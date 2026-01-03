import { getContext } from "svelte";
import type { Readable } from "svelte/store";
import type { CakeState, CakeTier } from "@birthday-cake-loading/core";

export type CakeSvelteContext = {
  state: Readable<CakeState>;
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
};

export const BCL_CONTEXT_KEY = Symbol.for("birthday-cake-loading:sveltekit");

export const getCakeContext = (): CakeSvelteContext => {
  const ctx = getContext<CakeSvelteContext | undefined>(BCL_CONTEXT_KEY);
  if (!ctx) {
    throw new Error(
      "[birthday-cake-loading] Missing CakeProvider. Wrap your root layout with <CakeProvider>."
    );
  }
  return ctx;
};

