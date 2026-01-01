import type { CakeTier } from "./types";

export const CAKE_TIER_OVERRIDE_KEY = "bcl_tier_override";

export const getTierOverride = (): CakeTier | undefined => {
  if (typeof sessionStorage === "undefined") {
    return undefined;
  }
  const stored = sessionStorage.getItem(CAKE_TIER_OVERRIDE_KEY);
  if (!stored) {
    return undefined;
  }
  if (stored === "base" || stored === "lite" || stored === "rich" || stored === "ultra") {
    return stored;
  }
  return undefined;
};

export const setTierOverride = (tier?: CakeTier) => {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  if (!tier) {
    sessionStorage.removeItem(CAKE_TIER_OVERRIDE_KEY);
    return;
  }
  sessionStorage.setItem(CAKE_TIER_OVERRIDE_KEY, tier);
};
