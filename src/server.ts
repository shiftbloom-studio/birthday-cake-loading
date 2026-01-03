import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";

type HeadersLike =
  | Headers
  // e.g. Next.js ReadonlyHeaders
  | { get: (key: string) => string | null }
  | Record<string, string | string[] | undefined>;

const readHeader = (
  headers: HeadersLike,
  key: string
): string | undefined => {
  // Prefer the Web Headers API when available (covers Next.js `headers()` too).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyHeaders = headers as any;
  if (anyHeaders && typeof anyHeaders.get === "function") {
    return anyHeaders.get(key) ?? undefined;
  }
  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[key.toLowerCase()] ?? record[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const getServerSignalsFromHeaders = (
  headers: HeadersLike
): CakeSignals => {
  const saveDataHeader = readHeader(headers, "save-data");
  const saveData = typeof saveDataHeader === "string" ? saveDataHeader === "on" : undefined;

  const secChUaMobile = readHeader(headers, "sec-ch-ua-mobile");
  const secChPrefersReducedMotion = readHeader(headers, "sec-ch-prefers-reduced-motion");
  const secChPrefersReducedData = readHeader(headers, "sec-ch-prefers-reduced-data");
  const effectiveType = readHeader(headers, "ect") as CakeSignals["effectiveType"];
  const downlink = Number(readHeader(headers, "downlink"));
  const rtt = Number(readHeader(headers, "rtt"));
  const deviceMemory = Number(readHeader(headers, "device-memory"));
  const dpr = Number(readHeader(headers, "dpr"));
  const viewportWidth = Number(readHeader(headers, "viewport-width"));
  const viewportHeight = Number(readHeader(headers, "viewport-height"));

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

  const prefersReducedData =
    typeof secChPrefersReducedData === "string"
      ? secChPrefersReducedData.includes("reduce")
        ? true
        : secChPrefersReducedData.includes("no-preference")
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
    screenHeight: Number.isNaN(viewportHeight) ? undefined : viewportHeight,
    userAgentMobile,
    prefersReducedMotion,
    prefersReducedData
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
  headers: HeadersLike,
  config: CakeConfig = DEFAULT_CONFIG
) => {
  const signals = getServerSignalsFromHeaders(headers);
  const tier = getServerTier(signals, config);
  return { signals, tier };
};
