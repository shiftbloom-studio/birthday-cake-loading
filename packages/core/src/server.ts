import type { CakeConfig, CakeSignals, CakeTier } from "./types";
import { DEFAULT_CONFIG } from "./config";
import { resolveCakeTier } from "./tier";
import { resolveCakeFeatures } from "./features";

export const CLIENT_HINTS_ACCEPT_CH =
  "Sec-CH-UA-Mobile, Sec-CH-Prefers-Reduced-Motion, Sec-CH-Prefers-Reduced-Data, ECT, Downlink, RTT, Device-Memory, DPR, Viewport-Width, Viewport-Height";

// Some hints require an explicit Permissions-Policy to be sent by the origin.
export const CLIENT_HINTS_PERMISSIONS_POLICY =
  "ch-ua-mobile=(self), ch-prefers-reduced-motion=(self), ch-prefers-reduced-data=(self), ch-ect=(self), ch-downlink=(self), ch-rtt=(self), ch-device-memory=(self), ch-dpr=(self), ch-viewport-width=(self), ch-viewport-height=(self)";

export const CLIENT_HINTS_VARY =
  "Sec-CH-UA-Mobile, Sec-CH-Prefers-Reduced-Motion, Sec-CH-Prefers-Reduced-Data, ECT, Downlink, RTT, Device-Memory, DPR, Viewport-Width, Viewport-Height";

/**
 * Helper for framework adapters: response headers to request Client Hints.
 */
export const getClientHintsHeaders = () => ({
  "Accept-CH": CLIENT_HINTS_ACCEPT_CH,
  "Permissions-Policy": CLIENT_HINTS_PERMISSIONS_POLICY,
  Vary: CLIENT_HINTS_VARY
});

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

const EXPECTED_HINT_HEADERS = [
  "save-data",
  "sec-ch-ua-mobile",
  "sec-ch-prefers-reduced-motion",
  "sec-ch-prefers-reduced-data",
  "ect",
  "downlink",
  "rtt",
  "device-memory",
  "dpr",
  "viewport-width",
  "viewport-height"
] as const;

const hasAnyClientHint = (headers: HeadersLike) =>
  EXPECTED_HINT_HEADERS.some((key) => typeof readHeader(headers, key) === "string");

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

/**
 * Safe default for SSR: returns `undefined` if the request contains none of the
 * expected Client Hint headers. This keeps the initial render baseline-first.
 */
export const getServerCakeBootstrapFromHeadersIfPresent = (
  headers: HeadersLike,
  config: CakeConfig = DEFAULT_CONFIG
) => {
  if (!hasAnyClientHint(headers)) {
    return undefined;
  }
  return getServerCakeBootstrapFromHeaders(headers, config);
};

