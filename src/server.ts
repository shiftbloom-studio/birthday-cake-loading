import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";

const readHeader = (
  headers: Headers | Record<string, string | string[] | undefined>,
  key: string
): string | undefined => {
  if (headers instanceof Headers) {
    return headers.get(key) ?? undefined;
  }
  const value = headers[key.toLowerCase()] ?? headers[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const getServerSignalsFromHeaders = (
  headers: Headers | Record<string, string | string[] | undefined>
): CakeSignals => {
  const saveData = readHeader(headers, "save-data") === "on";
  const secChUaMobile = readHeader(headers, "sec-ch-ua-mobile");
  const secChPrefersReducedMotion = readHeader(headers, "sec-ch-prefers-reduced-motion");
  const effectiveType = readHeader(headers, "ect") as CakeSignals["effectiveType"];
  const downlink = Number(readHeader(headers, "downlink"));
  const rtt = Number(readHeader(headers, "rtt"));
  const deviceMemory = Number(readHeader(headers, "device-memory"));
  const dpr = Number(readHeader(headers, "dpr"));
  const viewportWidth = Number(readHeader(headers, "viewport-width"));

  const userAgentMobile =
    secChUaMobile === "?1" ? true : secChUaMobile === "?0" ? false : undefined;

  const prefersReducedMotion =
    typeof secChPrefersReducedMotion === "string"
      ? secChPrefersReducedMotion.includes("reduce")
        ? true
        : secChPrefersReducedMotion.includes("no-preference")
          ? false
          : undefined
      : undefined;

  return {
    saveData,
    effectiveType: effectiveType || undefined,
    downlinkMbps: Number.isNaN(downlink) ? undefined : downlink,
    rttMs: Number.isNaN(rtt) ? undefined : rtt,
    deviceMemoryGB: Number.isNaN(deviceMemory) ? undefined : deviceMemory,
    devicePixelRatio: Number.isNaN(dpr) ? undefined : dpr,
    screenWidth: Number.isNaN(viewportWidth) ? undefined : viewportWidth,
    userAgentMobile,
    prefersReducedMotion
  };
};

export const getServerTier = (
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
): CakeTier => resolveCakeTier(signals, config);

export const getServerFeatures = (
  tier: CakeTier,
  signals: CakeSignals,
  config: CakeConfig = DEFAULT_CONFIG
) => resolveCakeFeatures(tier, signals, config);

export const getServerCakeBootstrapFromHeaders = (
  headers: Headers | Record<string, string | string[] | undefined>,
  config: CakeConfig = DEFAULT_CONFIG
) => {
  const signals = getServerSignalsFromHeaders(headers);
  const tier = getServerTier(signals, config);
  return { signals, tier };
};
