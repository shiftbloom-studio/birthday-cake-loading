import type { CakeSignals } from "./types";

export const hasWindow = () => typeof window !== "undefined";

export const readConnection = () => {
  if (!hasWindow()) {
    return undefined;
  }

  const connection =
    (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        addEventListener?: (event: string, cb: () => void) => void;
        removeEventListener?: (event: string, cb: () => void) => void;
      };
    }).connection;

  return connection;
};

export const detectSignals = (): CakeSignals => {
  if (!hasWindow()) {
    return {};
  }

  const connection = readConnection();
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersReducedData =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-data: reduce)").matches;

  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
    .userAgentData;

  return {
    saveData: connection?.saveData,
    effectiveType: connection?.effectiveType as CakeSignals["effectiveType"],
    downlinkMbps: connection?.downlink,
    rttMs: connection?.rtt,
    deviceMemoryGB: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    devicePixelRatio: window.devicePixelRatio,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    prefersReducedMotion,
    prefersReducedData,
    userAgentMobile: uaData?.mobile
  };
};

export const subscribeToSignalChanges = (callback: () => void) => {
  if (!hasWindow()) {
    return () => undefined;
  }

  const connection = readConnection();
  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  const reducedDataQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-data: reduce)")
    : null;

  connection?.addEventListener?.("change", callback);
  reducedMotionQuery?.addEventListener?.("change", callback);
  reducedDataQuery?.addEventListener?.("change", callback);

  return () => {
    connection?.removeEventListener?.("change", callback);
    reducedMotionQuery?.removeEventListener?.("change", callback);
    reducedDataQuery?.removeEventListener?.("change", callback);
  };
};
