import React from "react";
import type { CakeWatchtowerConfig, CakeWatchtowerSensitivity } from "./types";
import { useCakeConfig } from "./context";

type WatchtowerSnapshot = {
  enabled: boolean;
  janky: boolean;
  targets?: string[];
};

const watchtowerListeners = new Set<() => void>();
let watchtowerSnapshot: WatchtowerSnapshot = {
  enabled: false,
  janky: false
};

const notifyWatchtowerListeners = () => {
  watchtowerListeners.forEach((listener) => listener());
};

const setWatchtowerSnapshot = (next: WatchtowerSnapshot) => {
  watchtowerSnapshot = next;
  notifyWatchtowerListeners();
};

const subscribeWatchtower = (listener: () => void) => {
  watchtowerListeners.add(listener);
  return () => watchtowerListeners.delete(listener);
};

const getWatchtowerSnapshot = () => watchtowerSnapshot;

const WATCHTOWER_PRESETS: Record<
  CakeWatchtowerSensitivity,
  {
    fpsThreshold: number;
    windowMs: number;
    longTaskMs: number;
    longTaskCount: number;
    recoveryMs: number;
    minJankIntervalMs: number;
  }
> = {
  low: {
    fpsThreshold: 40,
    windowMs: 5000,
    longTaskMs: 200,
    longTaskCount: 2,
    recoveryMs: 7000,
    minJankIntervalMs: 2500
  },
  medium: {
    fpsThreshold: 50,
    windowMs: 3000,
    longTaskMs: 150,
    longTaskCount: 1,
    recoveryMs: 5000,
    minJankIntervalMs: 1500
  },
  high: {
    fpsThreshold: 55,
    windowMs: 2000,
    longTaskMs: 100,
    longTaskCount: 1,
    recoveryMs: 3500,
    minJankIntervalMs: 1000
  }
};

const resolveWatchtowerConfig = (
  config?: Partial<CakeWatchtowerConfig>
): CakeWatchtowerConfig => ({
  enabled: Boolean(config?.enabled),
  sensitivity: config?.sensitivity ?? "medium",
  targets: config?.targets
});

export const useCakeWatchtower = (watchKey?: string) => {
  const snapshot = React.useSyncExternalStore(
    subscribeWatchtower,
    getWatchtowerSnapshot,
    getWatchtowerSnapshot
  );
  const targeted =
    Boolean(watchKey) && (!snapshot.targets || snapshot.targets.includes(watchKey ?? ""));
  return {
    enabled: snapshot.enabled,
    janky: snapshot.janky,
    downgrade: snapshot.enabled && snapshot.janky && targeted
  };
};

export interface CakeWatchSwapProps {
  showPrimary: boolean;
  primary?: React.ReactNode;
  fallback?: React.ReactNode;
  containerAs?: React.ElementType;
  containerProps?: React.HTMLAttributes<HTMLElement>;
  containerRef?: React.RefCallback<HTMLElement>;
}

export const CakeWatchSwap = ({
  showPrimary,
  primary,
  fallback,
  containerAs,
  containerProps,
  containerRef
}: CakeWatchSwapProps) => {
  if (!fallback) {
    return showPrimary ? <>{primary}</> : null;
  }

  const Container = containerAs ?? "span";
  const baseStyle: React.CSSProperties = {
    display: "grid"
  };
  const mergedStyle: React.CSSProperties = {
    ...baseStyle,
    ...(containerProps?.style ?? {})
  };
  const primaryStyle: React.CSSProperties = primary
    ? {
        gridArea: "1 / 1",
        opacity: showPrimary ? 1 : 0,
        visibility: showPrimary ? "visible" : "hidden",
        pointerEvents: showPrimary ? "auto" : "none",
        transition: "opacity 120ms ease"
      }
    : {};
  const fallbackStyle: React.CSSProperties = {
    gridArea: "1 / 1",
    opacity: showPrimary ? 0 : 1,
    visibility: showPrimary ? "hidden" : "visible",
    pointerEvents: showPrimary ? "none" : "auto",
    transition: "opacity 120ms ease"
  };

  return (
    <Container
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={containerRef as any}
      {...containerProps}
      style={mergedStyle}
    >
      {primary ? (
        <span style={primaryStyle} aria-hidden={!showPrimary}>
          {primary}
        </span>
      ) : null}
      <span style={fallbackStyle} aria-hidden={showPrimary}>
        {fallback}
      </span>
    </Container>
  );
};

export const CakeWatchtower = () => {
  const config = useCakeConfig();
  const resolvedConfig = React.useMemo(
    () => resolveWatchtowerConfig(config.watchtower),
    [config.watchtower]
  );
  const { enabled, sensitivity, targets } = resolvedConfig;
  const [janky, setJanky] = React.useState(false);
  const cooldownId = React.useRef<number | null>(null);
  const lastJankAt = React.useRef(0);

  const triggerJank = React.useCallback(
    (settings: (typeof WATCHTOWER_PRESETS)[CakeWatchtowerSensitivity]) => {
      if (!enabled || typeof window === "undefined") {
        return;
      }
      const now = window.performance?.now?.() ?? Date.now();
      if (now - lastJankAt.current < settings.minJankIntervalMs) {
        return;
      }
      lastJankAt.current = now;
      setJanky(true);
      if (cooldownId.current) {
        window.clearTimeout(cooldownId.current);
      }
      cooldownId.current = window.setTimeout(() => setJanky(false), settings.recoveryMs);
    },
    [enabled]
  );

  React.useEffect(() => {
    if (!enabled) {
      setJanky(false);
    }
  }, [enabled]);

  React.useEffect(() => {
    const snapshot: WatchtowerSnapshot = {
      enabled,
      janky,
      targets
    };
    setWatchtowerSnapshot(snapshot);
  }, [enabled, janky, targets]);

  React.useEffect(() => {
    return () => {
      if (cooldownId.current) {
        window.clearTimeout(cooldownId.current);
      }
      setWatchtowerSnapshot({ enabled: false, janky: false });
    };
  }, []);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const settings = WATCHTOWER_PRESETS[sensitivity];
    let frameCount = 0;
    let windowStart = window.performance?.now?.() ?? Date.now();
    let rafId = 0;

    const loop = (timestamp: number) => {
      if (!enabled) {
        return;
      }
      frameCount += 1;
      const elapsed = timestamp - windowStart;
      if (elapsed >= settings.windowMs) {
        const fps = (frameCount * 1000) / elapsed;
        if (fps < settings.fpsThreshold) {
          triggerJank(settings);
        }
        frameCount = 0;
        windowStart = timestamp;
      }
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [enabled, sensitivity, triggerJank]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
      return;
    }

    const settings = WATCHTOWER_PRESETS[sensitivity];
    let longTaskTimestamps: number[] = [];
    const observer = new PerformanceObserver((list) => {
      const now = window.performance?.now?.() ?? Date.now();
      longTaskTimestamps = longTaskTimestamps.filter(
        (timestamp) => now - timestamp <= settings.windowMs
      );
      list.getEntries().forEach((entry) => {
        if (entry.duration >= settings.longTaskMs) {
          longTaskTimestamps.push(entry.startTime);
        }
      });
      if (longTaskTimestamps.length >= settings.longTaskCount) {
        triggerJank(settings);
      }
    });

    try {
      observer.observe({ type: "longtask", buffered: true } as PerformanceObserverInit);
    } catch {
      return;
    }

    return () => observer.disconnect();
  }, [enabled, sensitivity, triggerJank]);

  return null;
};

export const CakeWatch = CakeWatchtower;
