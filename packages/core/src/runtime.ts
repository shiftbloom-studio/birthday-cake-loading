import type { CakeBootstrap, CakeConfig, CakeSignals, CakeState, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { detectSignals, hasWindow, subscribeToSignalChanges } from "./signals";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";
import { getTierOverride, setTierOverride as persistTierOverride } from "./override";

export interface CakeRuntimeOptions {
  config?: Partial<CakeConfig>;
  /**
   * Optional server/bootstrap values (e.g. from Client Hints headers).
   * Prefer this over `initialSignals` / `initialTier` for SSR consistency.
   */
  bootstrap?: CakeBootstrap;
  /**
   * If false, BCL will not automatically call `refresh()` on creation (in the browser).
   *
   * Default: true
   */
  autoDetect?: boolean;
  /**
   * If provided, overrides `config.watchSignals`.
   */
  watchSignals?: boolean;
  onChange?: (state: CakeState) => void;
}

export interface CakeRuntime {
  getState: () => CakeState;
  subscribe: (listener: (state: CakeState) => void) => () => void;
  refresh: () => void;
  setTierOverride: (tier?: CakeTier) => void;
  destroy: () => void;
}

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

export const createCakeRuntime = ({
  config,
  bootstrap,
  autoDetect = true,
  watchSignals,
  onChange
}: CakeRuntimeOptions = {}): CakeRuntime => {
  const mergedConfig = mergeConfig(config);
  const effectiveWatchSignals = watchSignals ?? mergedConfig.watchSignals ?? true;

  let state: CakeState = (() => {
    const bootstrapSignals = bootstrap?.signals ?? {};
    const bootstrapTier = bootstrap?.tier;
    if (bootstrapTier) {
      return {
        signals: bootstrapSignals,
        tier: bootstrapTier,
        features: resolveCakeFeatures(bootstrapTier, bootstrapSignals, mergedConfig),
        ready: true
      };
    }
    if (bootstrap?.signals) {
      // If only signals are provided, compute tier and features immediately.
      return computeState(bootstrapSignals, mergedConfig, undefined);
    }
    return { ...DEFAULT_STATE };
  })();

  const listeners = new Set<(s: CakeState) => void>();
  const emit = (next: CakeState) => {
    for (const l of listeners) {
      l(next);
    }
  };

  const setState = (next: CakeState) => {
    state = next;
    onChange?.(next);
    emit(next);
  };

  const refresh = () => {
    const nextSignals = detectSignals();
    const override = getTierOverride();
    setState(computeState(nextSignals, mergedConfig, override));
  };

  const setTierOverride = (tier?: CakeTier) => {
    persistTierOverride(tier);
    refresh();
  };

  let unsubscribeSignals: (() => void) | null = null;
  if (effectiveWatchSignals && hasWindow()) {
    unsubscribeSignals = subscribeToSignalChanges(refresh);
  }

  if (autoDetect && hasWindow()) {
    // Defer one tick to stay baseline-first and avoid blocking initial render.
    window.setTimeout(() => refresh(), 0);
  }

  const subscribe = (listener: (s: CakeState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destroy = () => {
    unsubscribeSignals?.();
    unsubscribeSignals = null;
    listeners.clear();
  };

  return {
    getState: () => state,
    subscribe,
    refresh,
    setTierOverride,
    destroy
  };
};

