import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { CAKE_TIERS, isConnectionType } from "./types";
import { DEFAULT_CONFIG } from "./config";

const TIER_RANK: Record<CakeTier, number> = {
  base: 0,
  lite: 1,
  rich: 2,
  ultra: 3,
};

const is2G = (effectiveType?: CakeSignals["effectiveType"]) =>
  effectiveType === "slow-2g" || effectiveType === "2g";

const is3G = (effectiveType?: CakeSignals["effectiveType"]) => effectiveType === "3g";

export const resolveCakeTier = (
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG,
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
  const ultraMemory =
    typeof deviceMemory === "number" && deviceMemory >= tiering.ultraMemoryGB;
  const ultraCores =
    typeof cores === "number" && cores >= tiering.ultraCpuCores;

  let tier: CakeTier;
  if (saveData || veryLowMemory || is2G(effectiveType)) {
    tier = "base";
  } else if (
    lowMemory ||
    lowCores ||
    is3G(effectiveType) ||
    constrainedNetwork
  ) {
    tier = "lite";
  } else if (ultraMemory && ultraCores && !saveData) {
    tier = "ultra";
  } else {
    tier = "rich";
  }

  // A low battery steps the tier down one step, so a phone about to die does
  // not spend its last charge on the richest experience. Charging restores
  // the tier, and lowBatteryLevel: false turns the rule off.
  const lowBatteryLevel = tiering.lowBatteryLevel;
  if (
    lowBatteryLevel !== false &&
    typeof signals.batteryLevel === "number" &&
    signals.charging === false &&
    signals.batteryLevel <= lowBatteryLevel
  ) {
    tier = CAKE_TIERS[Math.max(0, TIER_RANK[tier] - 1)];
  }

  return tier;
};

export const tierAtLeast = (tier: CakeTier, minimum: CakeTier) => {
  return TIER_RANK[tier] >= TIER_RANK[minimum];
};
