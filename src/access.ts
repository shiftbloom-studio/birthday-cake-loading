import type { CakeFeatureKey, CakeFeatures, CakeTier } from "./types";
import { tierAtLeast } from "./tier";

export interface CakeGate {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
}

export const isCakeAllowed = (
  tier: CakeTier,
  features: CakeFeatures,
  { minTier, feature }: CakeGate
) => (feature ? features[feature] : tierAtLeast(tier, minTier ?? "rich"));
