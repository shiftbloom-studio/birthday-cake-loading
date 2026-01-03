import React from "react";
import type { CakeBootstrap, CakeConfig, CakeContextValue, CakeSignals, CakeState, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { detectSignals, subscribeToSignalChanges } from "./signals";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";
import { getTierOverride, setTierOverride as persistTierOverride } from "./override";

const DEFAULT_STATE: CakeState = {
  signals: {},
  tier: "base",
  features: {
    motion: false,
    smoothScroll: false,
    audio: false,
    privacyBanner: false,
    richImages: false
  },
  ready: false
};

const CakeContext = React.createContext<CakeContextValue>({
  ...DEFAULT_STATE,
  refresh: () => undefined,
  setTierOverride: () => undefined
});

export interface CakeProviderProps {
  children: React.ReactNode;
  config?: Partial<CakeConfig>;
  /**
   * Optional server/bootstrap values (e.g. from Client Hints headers).
   * Prefer this over `initialSignals` / `initialTier` for SSR consistency.
   */
  bootstrap?: CakeBootstrap;
  initialSignals?: CakeSignals;
  initialTier?: CakeTier;
  /**
   * If false, BCL will not automatically call `refresh()` on mount.
   * Useful for tests and for apps that want fully manual control.
   *
   * Default: true
   */
  autoDetect?: boolean;
  onChange?: (state: CakeState) => void;
}

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
  }
});

const computeState = (
  signals: CakeSignals,
  config: CakeConfig,
  override?: CakeTier
): CakeState => {
  const tier = override ?? resolveCakeTier(signals, config);
  return {
    signals,
    tier,
    features: resolveCakeFeatures(tier, signals, config),
    ready: true,
    override
  };
};

export const CakeProvider = ({
  children,
  config,
  bootstrap,
  initialSignals,
  initialTier,
  autoDetect = true,
  onChange
}: CakeProviderProps) => {
  const mergedConfig = React.useMemo(() => mergeConfig(config), [config]);
  const [state, setState] = React.useState<CakeState>(() => {
    const bootstrapSignals = bootstrap?.signals ?? initialSignals ?? {};
    const bootstrapTier = bootstrap?.tier ?? initialTier;

    if (bootstrapTier) {
      return {
        signals: bootstrapSignals,
        tier: bootstrapTier,
        features: resolveCakeFeatures(bootstrapTier, bootstrapSignals, mergedConfig),
        ready: true
      };
    }
    return { ...DEFAULT_STATE, signals: initialSignals ?? {} };
  });

  const refresh = React.useCallback(() => {
    const nextSignals = detectSignals();
    const override = getTierOverride();
    const nextState = computeState(nextSignals, mergedConfig, override);
    setState(nextState);
    onChange?.(nextState);
  }, [mergedConfig, onChange]);

  const setTierOverride = React.useCallback(
    (tier?: CakeTier) => {
      persistTierOverride(tier);
      refresh();
    },
    [refresh]
  );

  React.useEffect(() => {
    if (!autoDetect) {
      return;
    }
    refresh();
  }, [autoDetect, refresh]);

  React.useEffect(() => {
    if (!mergedConfig.watchSignals) {
      return undefined;
    }

    return subscribeToSignalChanges(refresh);
  }, [mergedConfig.watchSignals, refresh]);

  React.useEffect(() => {
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

    if (state.override) {
      html.dataset.bclOverride = state.override;
    } else {
      delete html.dataset.bclOverride;
    }

    if (state.signals.effectiveType) {
      html.dataset.bclEct = state.signals.effectiveType;
    } else {
      delete html.dataset.bclEct;
    }
  }, [state]);

  React.useEffect(() => {
    if (!mergedConfig.debug) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__BCL__ = state;
    // eslint-disable-next-line no-console
    console.debug("[birthday-cake-loading]", state);
  }, [mergedConfig.debug, state]);

  const value: CakeContextValue = React.useMemo(
    () => ({
      ...state,
      refresh,
      setTierOverride
    }),
    [state, refresh, setTierOverride]
  );

  return <CakeContext.Provider value={value}>{children}</CakeContext.Provider>;
};

export const useCake = () => React.useContext(CakeContext);

export const useCakeTier = () => React.useContext(CakeContext).tier;

export const useCakeFeatures = () => React.useContext(CakeContext).features;

export const useCakeSignals = () => React.useContext(CakeContext).signals;

export const useCakeReady = () => React.useContext(CakeContext).ready;
