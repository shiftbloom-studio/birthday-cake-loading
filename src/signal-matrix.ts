import type {
  CakeConfig,
  CakeSignalMatrixRule,
  CakeSignalMatrixCondition,
  CakeSignals,
  CakeTier
} from "./types";
import { DEFAULT_CONFIG } from "./config";

const TIER_RANK: Record<CakeTier, number> = {
  base: 0,
  lite: 1,
  rich: 2,
  ultra: 3
};

const DEFAULT_SIGNAL_MATRIX_RULES: CakeSignalMatrixRule[] = [
  {
    id: "reduced-motion-mobile-low-memory",
    description: "Conservative downgrade for reduced motion + low-memory mobile devices.",
    when: {
      prefersReducedMotion: true,
      userAgentMobile: true,
      maxDeviceMemoryGB: 4
    },
    adjust: { maxTier: "lite" }
  },
  {
    id: "reduced-data-mobile-constrained-network",
    description: "Keep heavy animations off for reduced data + slower mobile networks.",
    when: {
      prefersReducedData: true,
      userAgentMobile: true,
      effectiveType: ["slow-2g", "2g", "3g"]
    },
    adjust: { maxTier: "lite" }
  },
  {
    id: "very-low-memory-mobile",
    description: "Prioritize baseline for very low-memory mobile devices.",
    when: {
      userAgentMobile: true,
      maxDeviceMemoryGB: 2,
      maxHardwareConcurrency: 4
    },
    adjust: { setTier: "base" }
  },
  {
    id: "small-screen-high-density-reduced-motion",
    description: "Avoid heavy motion on small high-density screens when motion is reduced.",
    when: {
      prefersReducedMotion: true,
      minDevicePixelRatio: 2,
      maxScreenWidth: 900
    },
    adjust: { maxTier: "lite" }
  }
];

const matchesBoolean = (value: boolean | undefined, expected: boolean) =>
  typeof value === "boolean" && value === expected;

const matchesNumber = (
  value: number | undefined,
  minValue?: number,
  maxValue?: number
) => {
  if (typeof value !== "number") {
    return false;
  }
  if (typeof minValue === "number" && value < minValue) {
    return false;
  }
  if (typeof maxValue === "number" && value > maxValue) {
    return false;
  }
  return true;
};

const matchesEffectiveType = (
  value: CakeSignals["effectiveType"],
  expected?: CakeSignalMatrixRule["when"]["effectiveType"]
) => {
  if (!expected) {
    return true;
  }
  if (Array.isArray(expected)) {
    return expected.includes(value as typeof expected[number]);
  }
  return value === expected;
};

const matchesCommonConditions = (signals: CakeSignals, when: CakeSignalMatrixCondition) => {
  if (
    typeof when.prefersReducedMotion === "boolean" &&
    !matchesBoolean(signals.prefersReducedMotion, when.prefersReducedMotion)
  ) return false;

  if (
    typeof when.prefersReducedData === "boolean" &&
    !matchesBoolean(signals.prefersReducedData, when.prefersReducedData)
  ) return false;

  if (
    typeof when.saveData === "boolean" &&
    !matchesBoolean(signals.saveData, when.saveData)
  ) return false;

  if (
    typeof when.userAgentMobile === "boolean" &&
    !matchesBoolean(signals.userAgentMobile, when.userAgentMobile)
  ) return false;

  return true;
};

const matchesDeviceConditions = (signals: CakeSignals, when: CakeSignalMatrixCondition) => {
  if (
    (typeof when.minDeviceMemoryGB === "number" || typeof when.maxDeviceMemoryGB === "number") &&
    !matchesNumber(signals.deviceMemoryGB, when.minDeviceMemoryGB, when.maxDeviceMemoryGB)
  ) return false;

  if (
    (typeof when.minHardwareConcurrency === "number" || typeof when.maxHardwareConcurrency === "number") &&
    !matchesNumber(signals.hardwareConcurrency, when.minHardwareConcurrency, when.maxHardwareConcurrency)
  ) return false;

  if (
    (typeof when.minDevicePixelRatio === "number" || typeof when.maxDevicePixelRatio === "number") &&
    !matchesNumber(signals.devicePixelRatio, when.minDevicePixelRatio, when.maxDevicePixelRatio)
  ) return false;

  return true;
};

const matchesScreenConditions = (signals: CakeSignals, when: CakeSignalMatrixCondition) => {
  if (
    (typeof when.minScreenWidth === "number" || typeof when.maxScreenWidth === "number") &&
    !matchesNumber(signals.screenWidth, when.minScreenWidth, when.maxScreenWidth)
  ) return false;

  if (
    (typeof when.minScreenHeight === "number" || typeof when.maxScreenHeight === "number") &&
    !matchesNumber(signals.screenHeight, when.minScreenHeight, when.maxScreenHeight)
  ) return false;

  return true;
};

const matchesNetworkConditions = (signals: CakeSignals, when: CakeSignalMatrixCondition) => {
  if (!matchesEffectiveType(signals.effectiveType, when.effectiveType)) return false;

  if (
    typeof when.maxDownlinkMbps === "number" &&
    !matchesNumber(signals.downlinkMbps, undefined, when.maxDownlinkMbps)
  ) return false;

  if (
    typeof when.minRttMs === "number" &&
    !matchesNumber(signals.rttMs, when.minRttMs, undefined)
  ) return false;

  return true;
};

const matchesRule = (signals: CakeSignals, rule: CakeSignalMatrixRule) => {
  const { when } = rule;
  return (
    matchesCommonConditions(signals, when) &&
    matchesNetworkConditions(signals, when) &&
    matchesDeviceConditions(signals, when) &&
    matchesScreenConditions(signals, when)
  );
};

const clampTier = (tier: CakeTier, minTier?: CakeTier, maxTier?: CakeTier) => {
  let nextTier = tier;
  if (minTier && TIER_RANK[nextTier] < TIER_RANK[minTier]) {
    nextTier = minTier;
  }
  if (maxTier && TIER_RANK[nextTier] > TIER_RANK[maxTier]) {
    nextTier = maxTier;
  }
  return nextTier;
};

const mergeRules = (
  defaults: CakeSignalMatrixRule[],
  overrides?: CakeSignalMatrixRule[]
) => {
  if (!overrides || overrides.length === 0) {
    return defaults;
  }
  const merged = [...defaults];


  // Update existing rules or add new ones
  for (const override of overrides) {
    const startIdx = defaults.findIndex(r => r.id === override.id);
    if (startIdx >= 0) {
      merged[startIdx] = override;
    } else {
      merged.push(override);
    }
  }
  return merged;
};

export const applySignalMatrix = (
  tier: CakeTier,
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
) => {
  if (!config.advanced?.signalMatrix) {
    return tier;
  }

  const rules = mergeRules(
    DEFAULT_SIGNAL_MATRIX_RULES,
    config.advanced.signalMatrixRules
  );

  let nextTier = tier;
  for (const rule of rules) {
    if (!matchesRule(signals, rule)) {
      continue;
    }
    if (rule.adjust.setTier) {
      nextTier = rule.adjust.setTier;
      continue;
    }
    nextTier = clampTier(nextTier, rule.adjust.minTier, rule.adjust.maxTier);
  }

  return nextTier;
};

export const getSignalMatrixRules = (
  config: CakeConfig = DEFAULT_CONFIG
): CakeSignalMatrixRule[] =>
  mergeRules(DEFAULT_SIGNAL_MATRIX_RULES, config.advanced?.signalMatrixRules);

