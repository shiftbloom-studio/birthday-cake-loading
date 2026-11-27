import type { CakeSignals } from "./types";
import { isConnectionType } from "./types";

export const hasWindow = () => typeof window !== "undefined";
// The Battery Status API is async, while detectSignals() is sync, so the
// latest battery reading is cached here once subscribeToSignalChanges() has
// asked for it. A later detectSignals() then picks it up.
let battery: Pick<CakeSignals, "batteryLevel" | "charging"> = {};

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
    prefersContrastMore,
    ...battery
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
  const stopBattery = watchBattery(callback);

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
    stopBattery();

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

// The Battery Status API is not part of TypeScript's DOM library, so declare
// the small part of it this file uses.
type BatteryManagerLike = {
  level: number;
  charging: boolean;
  addEventListener: (type: "levelchange" | "chargingchange", listener: () => void) => void;
  removeEventListener: (type: "levelchange" | "chargingchange", listener: () => void) => void;
};

function watchBattery(callback: () => void): () => void {
  // Battery: the API is async and only exists in Chromium-based browsers, so
  // the fields start out unknown and are filled in here. The callback re-runs
  // detectSignals(), which reads the cached values.
  let batteryManager: BatteryManagerLike | undefined;
  let stopped = false;
  const onBatteryChange = () => {
    if (!batteryManager) {
      return;
    }
    battery = { batteryLevel: batteryManager.level, charging: batteryManager.charging };
    callback();
  };
  const navigatorWithBattery = navigator as Navigator & {
    getBattery?: () => Promise<BatteryManagerLike>;
  };

  if (typeof navigatorWithBattery.getBattery !== "function") {
    return () => undefined;
  }
  navigatorWithBattery
    .getBattery()
    .then((manager) => {
      if (stopped) {
        return;
      }
      batteryManager = manager;
      battery = { batteryLevel: manager.level, charging: manager.charging };
      manager.addEventListener("levelchange", onBatteryChange);
      manager.addEventListener("chargingchange", onBatteryChange);
      callback();
    })
    .catch(() => undefined);
  return () => {
    stopped = true;
    if (!batteryManager) {
      return;
    }
    batteryManager.removeEventListener("levelchange", onBatteryChange);
    batteryManager.removeEventListener("chargingchange", onBatteryChange);
  };
}
