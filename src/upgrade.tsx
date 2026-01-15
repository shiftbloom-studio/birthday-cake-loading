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
    () => (canUpgrade ? React.lazy(loader) : null),
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

  const observerRef = React.useRef<IntersectionObserver | null>(null);

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
      const idleWindow = window as Window & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: { timeout?: number }
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (typeof idleWindow.requestIdleCallback === "function") {
        const idleId = idleWindow.requestIdleCallback(() => setTriggered(true), {
          timeout: normalized.timeoutMs
        });
        return () => idleWindow.cancelIdleCallback?.(idleId);
      }
      const id = window.setTimeout(() => setTriggered(true), 1);
      return () => window.clearTimeout(id);
    }

    if (normalized.type === "visible") {
      if (typeof IntersectionObserver === "undefined") {
        setTriggered(true);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTriggered(true);
          observer.disconnect();
        }
      });

      observerRef.current = observer;

      return () => {
        observer.disconnect();
        observerRef.current = null;
      };
    }

    // interaction: handled by event props
  }, [canUpgrade, normalized, triggered]);

  React.useEffect(() => {
    if (!canUpgrade || triggered) {
      return;
    }

    if (normalized.type !== "visible") {
      return;
    }

    const observer = observerRef.current;

    if (!observer || !target) {
      return;
    }

    observer.observe(target);

    return () => {
      if (target && observer.unobserve) {
        observer.unobserve(target);
      }
    };
  }, [canUpgrade, normalized, target, triggered]);

  const shouldRender = canUpgrade && (normalized.type === "immediate" || triggered);

  const primary =
    shouldRender && LazyComponent ? (
      <React.Suspense fallback={fallback}>
        {React.createElement(
          LazyComponent,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (props ?? ({} as P)) as any
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
        containerRef={
          normalized.type === "visible"
            ? (node: HTMLElement | null) => {
                setTarget(node);
              }
            : undefined
        }
      />
    );
  }

  return (
    <Container
      ref={
        normalized.type === "visible"
          ? (node: HTMLElement | null) => {
              setTarget(node);
            }
          : undefined
      }
      {...mergedProps}
    >
      {primary ?? fallback}
    </Container>
  );
};
