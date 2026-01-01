export type CakeTier = "base" | "lite" | "rich" | "ultra";

export type ConnectionType = "slow-2g" | "2g" | "3g" | "4g";

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
