import type { CakeSignals } from "./types";
import { isConnectionType } from "./types";

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

  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  const userAgent = (navigator as Navigator & { userAgent?: string }).userAgent;
  const userAgentMobileFallback = typeof userAgent === "string"
    ? /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(userAgent)
    : undefined;

  const effectiveType = connection?.effectiveType;
  const prefersContrastMore =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-contrast: more)").matches;

  return {
    saveData: connection?.saveData,
    effectiveType: isConnectionType(effectiveType) ? effectiveType : undefined,
    downlinkMbps: connection?.downlink,
    rttMs: connection?.rtt,
    deviceMemoryGB: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    devicePixelRatio: window.devicePixelRatio,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    prefersReducedMotion,
    prefersReducedData,
    userAgentMobile: uaData?.mobile ?? userAgentMobileFallback,
    online: navigator.onLine,
    prefersContrastMore
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
  const contrastQuery = window.matchMedia
    ? window.matchMedia("(prefers-contrast: more)")
    : null;

  const addMediaListener = (mql: MediaQueryList | null, cb: () => void) => {
    if (!mql) {
      return;
    }
    // Safari < 14
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMql = mql as any;
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", cb);
    } else if (typeof anyMql.addListener === "function") {
      anyMql.addListener(cb);
    }
  };

  const removeMediaListener = (mql: MediaQueryList | null, cb: () => void) => {
    if (!mql) {
      return;
    }
    // Safari < 14
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMql = mql as any;
    if (typeof mql.removeEventListener === "function") {
      mql.removeEventListener("change", cb);
    } else if (typeof anyMql.removeListener === "function") {
      anyMql.removeListener(cb);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyConnection = connection as any;
  if (typeof connection?.addEventListener === "function") {
    connection.addEventListener("change", callback);
  } else if (typeof anyConnection?.onchange !== "undefined") {
    anyConnection.onchange = callback;
  }

  addMediaListener(reducedMotionQuery, callback);
  addMediaListener(reducedDataQuery, callback);
  addMediaListener(contrastQuery, callback);

  let resizeRaf: number | null = null;
  const onResize = () => {
    if (resizeRaf !== null) {
      return;
    }
    resizeRaf = window.requestAnimationFrame(() => {
      resizeRaf = null;
      callback();
    });
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  document.addEventListener("visibilitychange", callback);
  window.addEventListener("pageshow", callback);

  return () => {
    if (typeof connection?.removeEventListener === "function") {
      connection.removeEventListener("change", callback);
    } else if (typeof anyConnection?.onchange !== "undefined") {
      anyConnection.onchange = null;
    }

    removeMediaListener(reducedMotionQuery, callback);
    removeMediaListener(reducedDataQuery, callback);
    removeMediaListener(contrastQuery, callback);

    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
    document.removeEventListener("visibilitychange", callback);
    window.removeEventListener("pageshow", callback);

    if (resizeRaf !== null) {
      window.cancelAnimationFrame(resizeRaf);
      resizeRaf = null;
    }
  };
};
