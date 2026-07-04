import { DEFAULT_CONFIG } from "./config";
import { detectSignals, subscribeToSignalChanges } from "./signals";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";
import { applySignalMatrix } from "./signal-matrix";
import type { CakeConfig, CakeState } from "./types";
import { ensureCakeTierVisibilityStyles } from "./cake-tier-visibility";

const mergeConfig = (config?: Partial<CakeConfig>): CakeConfig => ({
  ...DEFAULT_CONFIG,
  ...config,
  tiering: {
    ...DEFAULT_CONFIG.tiering,
    ...config?.tiering
  },
  features: {
    ...DEFAULT_CONFIG.features,
    ...config?.features
  },
  watchtower: {
    ...DEFAULT_CONFIG.watchtower,
    ...config?.watchtower
  },
  advanced: {
    ...DEFAULT_CONFIG.advanced,
    ...config?.advanced
  }
});

const writeDataset = (state: CakeState) => {
  if (typeof document === "undefined") {
    return;
  }

  const html = document.documentElement;
  html.dataset.bclTier = state.tier;
  html.dataset.bclReady = String(state.ready);
  html.dataset.bclMotion = String(state.features.motion);
  html.dataset.bclSmoothScroll = String(state.features.smoothScroll);
  html.dataset.bclAudio = String(state.features.audio);
  html.dataset.bclPrivacy = String(state.features.privacyBanner);
  html.dataset.bclRichImages = String(state.features.richImages);
  html.dataset.bclSaveData = String(Boolean(state.signals.saveData));
  html.dataset.bclOnline = String(state.signals.online ?? true);
  html.dataset.bclContrastMore = String(Boolean(state.signals.prefersContrastMore));

  if (state.signals.effectiveType) {
    html.dataset.bclEct = state.signals.effectiveType;
  } else {
    delete html.dataset.bclEct;
  }
};

export const initCakeRuntime = (config?: Partial<CakeConfig>) => {
  const mergedConfig = mergeConfig(config);
  ensureCakeTierVisibilityStyles();

  const refresh = () => {
    const signals = detectSignals();
    const initialTier = resolveCakeTier(signals, mergedConfig);
    const tier = applySignalMatrix(initialTier, signals, mergedConfig);
    const state: CakeState = {
      signals,
      tier,
      features: resolveCakeFeatures(tier, signals, mergedConfig),
      ready: true
    };
    writeDataset(state);
  };

  refresh();

  if (!mergedConfig.watchSignals) {
    return () => undefined;
  }

  return subscribeToSignalChanges(refresh);
};
