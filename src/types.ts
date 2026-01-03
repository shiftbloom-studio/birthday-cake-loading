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

export interface CakeConfig {
  tiering: CakeTierConfig;
  features: CakeFeatureConfig;
  debug?: boolean;
  watchSignals?: boolean;
}

export interface CakeState {
  signals: CakeSignals;
  tier: CakeTier;
  features: CakeFeatures;
  ready: boolean;
  override?: CakeTier;
}

export interface CakeContextValue extends CakeState {
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
}
