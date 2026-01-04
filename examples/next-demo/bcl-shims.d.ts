declare module "@shiftbloom-studio/birthday-cake-loading/server" {
  import type {
    CakeConfig,
    CakeFeatures,
    CakeSignals,
    CakeTier
  } from "@shiftbloom-studio/birthday-cake-loading";

  export type HeadersLike =
    | Headers
    | { get: (key: string) => string | null }
    | Record<string, string | string[] | undefined>;

  export const getServerSignalsFromHeaders: (headers: HeadersLike) => CakeSignals;
  export const getServerTier: (signals: CakeSignals, config?: CakeConfig) => CakeTier;
  export const getServerFeatures: (
    tier: CakeTier,
    signals: CakeSignals,
    config?: CakeConfig
  ) => CakeFeatures;
  export const getServerCakeBootstrapFromHeaders: (
    headers: HeadersLike,
    config?: CakeConfig
  ) => { signals: CakeSignals; tier: CakeTier };
}

