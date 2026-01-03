import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { isConnectionType } from "./types";
import { DEFAULT_CONFIG } from "./config";

const TIER_RANK: Record<CakeTier, number> = {
  base: 0,
  lite: 1,
  rich: 2,
  ultra: 3
};

const is2G = (effectiveType?: CakeSignals["effectiveType"]) =>
  effectiveType === "slow-2g" || effectiveType === "2g";

const is3G = (effectiveType?: CakeSignals["effectiveType"]) => effectiveType === "3g";

export const resolveCakeTier = (
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
): CakeTier => {
  const tiering = config.tiering;
  const saveData = Boolean(signals.saveData ?? signals.prefersReducedData);
  const effectiveType = isConnectionType(signals.effectiveType)
    ? signals.effectiveType
    : undefined;
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
  return TIER_RANK[tier] >= TIER_RANK[minimum];
};
