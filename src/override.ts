import type { CakeTier } from "./types";

export const CAKE_TIER_OVERRIDE_KEY = "bcl_tier_override";

const canUseSessionStorage = () => {
  try {
    return typeof sessionStorage !== "undefined";
  } catch {
    return false;
  }
};

export const getTierOverride = (): CakeTier | undefined => {
  if (!canUseSessionStorage()) {
    return undefined;
  }

  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(CAKE_TIER_OVERRIDE_KEY);
  } catch {
    return undefined;
  }

  if (!stored) {
    return undefined;
  }
  if (stored === "base" || stored === "lite" || stored === "rich" || stored === "ultra") {
    return stored;
  }
  return undefined;
};

export const setTierOverride = (tier?: CakeTier) => {
  if (!canUseSessionStorage()) {
    return;
  }
  try {
    if (!tier) {
      sessionStorage.removeItem(CAKE_TIER_OVERRIDE_KEY);
      return;
    }
    sessionStorage.setItem(CAKE_TIER_OVERRIDE_KEY, tier);
  } catch {
    // Ignore storage errors (e.g. private mode, disabled storage).
  }
};
