import type { CakeConfig, CakeFeatures, CakeSignals, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { tierAtLeast } from "./tier";

const isConstrainedNetwork = (signals: CakeSignals) =>
  signals.saveData ||
  signals.prefersReducedData ||
  signals.effectiveType === "slow-2g" ||
  signals.effectiveType === "2g" ||
  (typeof signals.downlinkMbps === "number" && signals.downlinkMbps <= 1.5);

export const resolveCakeFeatures = (
  tier: CakeTier,
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
): CakeFeatures => {
  const reducedMotion = Boolean(signals.prefersReducedMotion);
  const saveData = Boolean(signals.saveData ?? signals.prefersReducedData);
  const allowMotion =
    tierAtLeast(tier, "rich") ||
    (tier === "lite" && config.features.allowMotionOnLite);

  const allowRichImages =
    tierAtLeast(tier, "lite") ||
    (tier === "base" && config.features.allowRichImagesOnBase);

  const networkConstrained = isConstrainedNetwork(signals);
  const audioAllowed =
    tierAtLeast(tier, "rich") &&
    !reducedMotion &&
    !saveData &&
    (!config.features.audioRequiresUnmetered || !networkConstrained);

  return {
    motion: allowMotion && !reducedMotion,
    smoothScroll: allowMotion && !reducedMotion,
    audio: audioAllowed,
    privacyBanner: tierAtLeast(tier, "rich") && !saveData,
    richImages: allowRichImages
  };
};
