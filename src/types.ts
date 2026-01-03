export const CAKE_TIERS = ["base", "lite", "rich", "ultra"] as const;
export type CakeTier = (typeof CAKE_TIERS)[number];

export const CONNECTION_TYPES = ["slow-2g", "2g", "3g", "4g"] as const;
export type ConnectionType = (typeof CONNECTION_TYPES)[number];

export const isCakeTier = (value: string): value is CakeTier =>
  (CAKE_TIERS as readonly string[]).includes(value);

export const isConnectionType = (value?: string): value is ConnectionType =>
  typeof value === "string" && (CONNECTION_TYPES as readonly string[]).includes(value);

export type CakeFeatureKey =
  | "motion"
  | "smoothScroll"
  | "audio"
  | "privacyBanner"
  | "richImages";

export interface CakeSignals {
  saveData?: boolean;
  effectiveType?: ConnectionType;
  downlinkMbps?: number;
  rttMs?: number;
  deviceMemoryGB?: number;
  hardwareConcurrency?: number;
  devicePixelRatio?: number;
  screenWidth?: number;
  screenHeight?: number;
  prefersReducedMotion?: boolean;
  prefersReducedData?: boolean;
  userAgentMobile?: boolean;
}

export interface CakeBootstrap {
  /**
   * Optional precomputed signals (e.g. from Client Hints headers on the server).
   */
  signals?: CakeSignals;
  /**
   * Optional precomputed tier (e.g. from `getServerTier(signals)`).
   */
  tier?: CakeTier;
}

export interface CakeFeatures {
  motion: boolean;
  smoothScroll: boolean;
  audio: boolean;
  privacyBanner: boolean;
  richImages: boolean;
}

export interface CakeTierConfig {
  lowMemoryGB: number;
  veryLowMemoryGB: number;
  lowCpuCores: number;
  ultraMemoryGB: number;
  ultraCpuCores: number;
  minDownlinkMbps: number;
  maxRttMs: number;
}

export interface CakeFeatureConfig {
  allowMotionOnLite: boolean;
  allowRichImagesOnBase: boolean;
  audioRequiresUnmetered: boolean;
}

export type CakeWatchtowerSensitivity = "low" | "medium" | "high";

export interface CakeWatchtowerConfig {
  enabled: boolean;
  sensitivity: CakeWatchtowerSensitivity;
  /**
   * Optional list of watch keys to downgrade when jank is detected.
   * If omitted, any layer/upgrade with a watch key is eligible.
   */
  targets?: string[];
}


export interface CakeSignalMatrixCondition {
  prefersReducedMotion?: boolean;
  prefersReducedData?: boolean;
  saveData?: boolean;
  userAgentMobile?: boolean;
  effectiveType?: ConnectionType | ConnectionType[];
  maxDeviceMemoryGB?: number;
  minDeviceMemoryGB?: number;
  maxHardwareConcurrency?: number;
  minHardwareConcurrency?: number;
  maxDevicePixelRatio?: number;
  minDevicePixelRatio?: number;
  maxScreenWidth?: number;
  minScreenWidth?: number;
  maxScreenHeight?: number;
  minScreenHeight?: number;
  maxDownlinkMbps?: number;
  minRttMs?: number;
}

export interface CakeSignalMatrixAdjustment {
  setTier?: CakeTier;
  maxTier?: CakeTier;
  minTier?: CakeTier;
}

export interface CakeSignalMatrixRule {
  id: string;
  description?: string;
  when: CakeSignalMatrixCondition;
  adjust: CakeSignalMatrixAdjustment;
}

export interface CakeAdvancedConfig {
  signalMatrix?: boolean;
  signalMatrixRules?: CakeSignalMatrixRule[];
}

export interface CakeConfig {
  tiering: CakeTierConfig;
  features: CakeFeatureConfig;
  advanced?: CakeAdvancedConfig;
  debug?: boolean;
  watchSignals?: boolean;
  watchtower?: Partial<CakeWatchtowerConfig>;
}

export interface CakeState {
  signals: CakeSignals;
  tier: CakeTier;
  features: CakeFeatures;
  ready: boolean;
  override?: CakeTier;
}

export interface CakeContextValue extends CakeState {
  config: CakeConfig;
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
}
