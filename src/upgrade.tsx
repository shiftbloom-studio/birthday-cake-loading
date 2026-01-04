import React from "react";
import type { CakeFeatureKey, CakeTier } from "./types";
import { useCake } from "./context";
import { isCakeAllowed } from "./access";
import { CakeWatchSwap, useCakeWatchtower } from "./watchtower";

export type CakeUpgradeStrategy =
  | "immediate"
  | "idle"
  | "visible"
  | "interaction"
  | { type: "timeout"; ms: number }
  | { type: "idle"; timeoutMs?: number }
  | { type: "visible"; rootMargin?: string; threshold?: number | number[] };

export type CakeUpgradeContainerTag =
  | "div"
  | "span"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "header"
  | "footer"
  | "nav";

type NormalizedStrategy =
  | { type: "immediate" }
  | { type: "idle"; timeoutMs?: number }
  | { type: "timeout"; ms: number }
  | { type: "visible"; rootMargin?: string; threshold?: number | number[] }
  | { type: "interaction" };

const normalizeStrategy = (strategy?: CakeUpgradeStrategy): NormalizedStrategy => {
  if (!strategy) {
    return { type: "idle" };
  }
  if (typeof strategy === "string") {
    if (strategy === "immediate") return { type: "immediate" };
    if (strategy === "idle") return { type: "idle" };
    if (strategy === "visible") return { type: "visible" };
    if (strategy === "interaction") return { type: "interaction" };
    return { type: "idle" };
  }
  return strategy.type === "timeout"
    ? { type: "timeout", ms: strategy.ms }
    : strategy.type === "idle"
      ? { type: "idle", timeoutMs: strategy.timeoutMs }
      : { type: "visible", rootMargin: strategy.rootMargin, threshold: strategy.threshold };
};

export interface CakeUpgradeProps<P extends object = Record<string, never>> {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  loader: () => Promise<{ default: React.ComponentType<P> }>;
  fallback?: React.ReactNode;
  props?: P;
  watchKey?: string;
  /**
   * When to actually load/activate the enhanced layer once it becomes allowed.
   *
   * Default: `"idle"` (baseline-first).
   */
  strategy?: CakeUpgradeStrategy;
  /**
   * Used only when `fallback` is not a single DOM element and the chosen strategy
   * needs a DOM target (`"visible"` / `"interaction"`).
   */
  containerAs?: CakeUpgradeContainerTag;
  containerProps?: React.HTMLAttributes<HTMLElement>;
}

export const CakeUpgrade = <P extends object = Record<string, never>>({
  minTier = "rich",
  feature,
  loader,
  fallback = null,
  props,
  watchKey,
  strategy,
  containerAs = "div",
  containerProps
}: CakeUpgradeProps<P>) => {
  const { tier, features, ready } = useCake();
  const allowed = isCakeAllowed(tier, features, { feature, minTier });
  const { downgrade } = useCakeWatchtower(watchKey);
  const canUpgrade = ready && allowed && !downgrade;

  const normalized = React.useMemo(() => normalizeStrategy(strategy), [strategy]);
  const LazyComponent = React.useMemo(
    (): React.LazyExoticComponent<React.ComponentType<P>> | null =>
      canUpgrade ? React.lazy(loader) : null,
    [canUpgrade, loader]
  );

  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const [triggered, setTriggered] = React.useState(false);

  const trigger = React.useCallback(() => {
    setTriggered(true);
  }, []);

  React.useEffect(() => {
    if (!canUpgrade) {
      setTriggered(false);
    }
  }, [canUpgrade]);

  React.useEffect(() => {
    if (!canUpgrade || triggered) {
      return;
    }

    if (normalized.type === "immediate") {
      setTriggered(true);
      return;
    }

    if (normalized.type === "timeout") {
      const id = window.setTimeout(() => setTriggered(true), normalized.ms);
      return () => window.clearTimeout(id);
    }

    if (normalized.type === "idle") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyWindow = window as any;
      if (typeof anyWindow.requestIdleCallback === "function") {
        const idleId = anyWindow.requestIdleCallback(() => setTriggered(true), {
          timeout: normalized.timeoutMs
        });
        return () => anyWindow.cancelIdleCallback?.(idleId);
      }
      const id = window.setTimeout(() => setTriggered(true), 1);
      return () => window.clearTimeout(id);
    }

    if (normalized.type === "visible") {
      if (!target) {
        return;
      }
      if (typeof IntersectionObserver === "undefined") {
        setTriggered(true);
        return;
      }
      const observerOptions = {
        rootMargin: normalized.rootMargin,
        threshold: normalized.threshold
      };
      const hasObserverOptions =
        observerOptions.rootMargin !== undefined ||
        observerOptions.threshold !== undefined;
      const observer = hasObserverOptions
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                setTriggered(true);
                observer.disconnect();
              }
            },
            observerOptions
          )
        : new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              setTriggered(true);
              observer.disconnect();
            }
          });
      observer.observe(target);
      return () => observer.disconnect();
    }

    // interaction: handled by event props
  }, [canUpgrade, normalized, target, triggered]);

  const shouldRender = canUpgrade && (normalized.type === "immediate" || triggered);

  const primary =
    shouldRender && LazyComponent ? (
      <React.Suspense fallback={fallback}>
        {React.createElement(
          LazyComponent as unknown as React.ComponentType<P>,
          props ?? ({} as P)
        )}
      </React.Suspense>
    ) : null;

  if (primary && (!watchKey || !fallback)) {
    return primary;
  }

  const needsTarget = normalized.type === "visible" || normalized.type === "interaction";
  if (!needsTarget) {
    if (watchKey && fallback) {
      return (
        <CakeWatchSwap showPrimary={Boolean(primary)} primary={primary} fallback={fallback} />
      );
    }
    return primary ?? (fallback as React.ReactElement | null);
  }

  const baseProps = containerProps ?? {};

  const interactionProps: React.HTMLAttributes<HTMLElement> | undefined =
    normalized.type === "interaction"
      ? {
          onPointerOver: (e) => {
            baseProps.onPointerOver?.(e);
            trigger();
          },
          onPointerDown: (e) => {
            baseProps.onPointerDown?.(e);
            trigger();
          },
          onTouchStart: (e) => {
            baseProps.onTouchStart?.(e);
            trigger();
          },
          onFocus: (e) => {
            baseProps.onFocus?.(e);
            trigger();
          },
          onClick: (e) => {
            baseProps.onClick?.(e);
            trigger();
          }
        }
      : undefined;

  const Container = containerAs;
  const mergedProps = {
    ...baseProps,
    ...interactionProps
  };

  if (watchKey && fallback) {
    return (
      <CakeWatchSwap
        showPrimary={Boolean(primary)}
        primary={primary}
        fallback={fallback}
        containerAs={Container}
        containerProps={mergedProps}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        containerRef={normalized.type === "visible" ? (setTarget as any) : undefined}
      />
    );
  }

  return (
    <Container
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={normalized.type === "visible" ? (setTarget as any) : undefined}
      {...mergedProps}
    >
      {primary ?? fallback}
    </Container>
  );
};
