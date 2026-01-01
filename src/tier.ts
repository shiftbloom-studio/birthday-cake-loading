import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";

const is2G = (effectiveType?: string) =>
  effectiveType === "slow-2g" || effectiveType === "2g";

const is3G = (effectiveType?: string) => effectiveType === "3g";

export const resolveCakeTier = (
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
): CakeTier => {
  const tiering = config.tiering;
  const saveData = Boolean(signals.saveData ?? signals.prefersReducedData);
  const effectiveType = signals.effectiveType;
  const downlink = signals.downlinkMbps;
  const rtt = signals.rttMs;

  const deviceMemory = signals.deviceMemoryGB;
  const cores = signals.hardwareConcurrency;

  const veryLowMemory =
    typeof deviceMemory === "number" && deviceMemory <= tiering.veryLowMemoryGB;
  const lowMemory =
    typeof deviceMemory === "number" && deviceMemory <= tiering.lowMemoryGB;
  const lowCores = typeof cores === "number" && cores <= tiering.lowCpuCores;

  const constrainedNetwork =
    is2G(effectiveType) ||
    (typeof downlink === "number" && downlink <= tiering.minDownlinkMbps) ||
    (typeof rtt === "number" && rtt >= tiering.maxRttMs);

  if (saveData || veryLowMemory || is2G(effectiveType)) {
    return "base";
  }

  if (lowMemory || lowCores || is3G(effectiveType) || constrainedNetwork) {
    return "lite";
  }

  const ultraMemory =
    typeof deviceMemory === "number" && deviceMemory >= tiering.ultraMemoryGB;
  const ultraCores = typeof cores === "number" && cores >= tiering.ultraCpuCores;

  if (ultraMemory && ultraCores && !saveData) {
    return "ultra";
  }

  return "rich";
};

export const tierAtLeast = (tier: CakeTier, minimum: CakeTier) => {
  const tiers: CakeTier[] = ["base", "lite", "rich", "ultra"];
  return tiers.indexOf(tier) >= tiers.indexOf(minimum);
};
