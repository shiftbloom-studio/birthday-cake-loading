import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { isConnectionType } from "./types";
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
  if ("get" in headers && typeof headers.get === "function") {
    return headers.get(key) ?? undefined;
  }

  // Fallback to record-style access
  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[key.toLowerCase()] ?? record[key];

  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const parseNumber = (value?: string): number | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseBooleanHeader = (headerValue: string | undefined): boolean | undefined => {
  if (typeof headerValue !== "string") return undefined;
  if (headerValue === "?1") return true;
  if (headerValue === "?0") return false;
  return undefined;
};

const parsePreferenceHeader = (headerValue: string | undefined): boolean | undefined => {
  if (typeof headerValue !== "string") return undefined;
  if (headerValue.includes("reduce")) return true;
  if (headerValue.includes("no-preference")) return false;
  return undefined;
};

export const getServerSignalsFromHeaders = (
  headers: HeadersLike
): CakeSignals => {
  const saveDataHeader = readHeader(headers, "save-data");
  const saveData = typeof saveDataHeader === "string" ? saveDataHeader === "on" : undefined;

  const effectiveTypeHeader = readHeader(headers, "ect");
  const effectiveType = isConnectionType(effectiveTypeHeader) ? effectiveTypeHeader : undefined;

  return {
    saveData,
    effectiveType,
    downlinkMbps: parseNumber(readHeader(headers, "downlink")),
    rttMs: parseNumber(readHeader(headers, "rtt")),
    deviceMemoryGB: parseNumber(readHeader(headers, "device-memory")),
    devicePixelRatio: parseNumber(readHeader(headers, "dpr")),
    screenWidth: parseNumber(readHeader(headers, "viewport-width")),
    screenHeight: parseNumber(readHeader(headers, "viewport-height")),
    userAgentMobile: parseBooleanHeader(readHeader(headers, "sec-ch-ua-mobile")),
    prefersReducedMotion: parsePreferenceHeader(readHeader(headers, "sec-ch-prefers-reduced-motion")),
    prefersReducedData: parsePreferenceHeader(readHeader(headers, "sec-ch-prefers-reduced-data"))
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

