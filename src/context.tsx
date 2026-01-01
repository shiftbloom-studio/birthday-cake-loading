"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CakeConfig, CakeContextValue, CakeSignals, CakeState, CakeTier } from "./types";
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

const CakeContext = createContext<CakeContextValue>({
  ...DEFAULT_STATE,
  refresh: () => undefined,
  setTierOverride: () => undefined
});

export interface CakeProviderProps {
  children: React.ReactNode;
  config?: Partial<CakeConfig>;
  initialSignals?: CakeSignals;
  initialTier?: CakeTier;
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
  initialSignals,
  initialTier,
  onChange
}: CakeProviderProps) => {
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);
  const [state, setState] = useState<CakeState>(() => {
    if (initialTier) {
      return computeState(initialSignals ?? {}, mergedConfig, initialTier);
    }
    return { ...DEFAULT_STATE, signals: initialSignals ?? {} };
  });

  const refresh = useCallback(() => {
    const nextSignals = detectSignals();
    const override = getTierOverride();
    const nextState = computeState(nextSignals, mergedConfig, override);
    setState(nextState);
    onChange?.(nextState);
  }, [mergedConfig, onChange]);

  const setTierOverride = useCallback(
    (tier?: CakeTier) => {
      persistTierOverride(tier);
      refresh();
    },
    [refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!mergedConfig.watchSignals) {
      return undefined;
    }

    return subscribeToSignalChanges(refresh);
  }, [mergedConfig.watchSignals, refresh]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const html = document.documentElement;
    html.dataset.bclTier = state.tier;
    html.dataset.bclReady = String(state.ready);
    html.dataset.bclMotion = String(state.features.motion);
    html.dataset.bclAudio = String(state.features.audio);
    html.dataset.bclPrivacy = String(state.features.privacyBanner);
    html.dataset.bclSaveData = String(Boolean(state.signals.saveData));
  }, [state]);

  const value: CakeContextValue = useMemo(
    () => ({
      ...state,
      refresh,
      setTierOverride
    }),
    [state, refresh, setTierOverride]
  );

  return <CakeContext.Provider value={value}>{children}</CakeContext.Provider>;
};

export const useCake = () => useContext(CakeContext);

export const useCakeTier = () => useContext(CakeContext).tier;

export const useCakeFeatures = () => useContext(CakeContext).features;

export const useCakeSignals = () => useContext(CakeContext).signals;

export const useCakeReady = () => useContext(CakeContext).ready;
