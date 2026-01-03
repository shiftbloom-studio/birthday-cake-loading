import React from "react";
import type { CakeFeatureKey, CakeTier } from "./types";
import { useCake } from "./context";
import { isCakeAllowed } from "./access";
import { CakeWatchSwap, useCakeWatchtower } from "./watchtower";

export interface CakeLayerProps {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  fallback?: React.ReactNode;
  watchKey?: string;
  children: React.ReactNode;
}

export const CakeLayer = ({
  minTier = "rich",
  feature,
  fallback = null,
  watchKey,
  children
}: CakeLayerProps) => {
  const { tier, features, ready } = useCake();
  const allowed = isCakeAllowed(tier, features, { feature, minTier });
  const { downgrade } = useCakeWatchtower(watchKey);
  const showPrimary = ready && allowed && !downgrade;

  if (!ready) {
    if (watchKey && fallback) {
      return (
        <CakeWatchSwap showPrimary={false} primary={null} fallback={fallback} />
      );
    }
    return fallback as React.ReactElement | null;
  }

  if (watchKey && fallback) {
    return (
      <CakeWatchSwap
        showPrimary={showPrimary}
        primary={showPrimary ? children : null}
        fallback={fallback}
      />
    );
  }

  return showPrimary ? <>{children}</> : (fallback as React.ReactElement | null);
};

export interface CakeLazyProps<P extends object = Record<string, never>> {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  loader: () => Promise<{ default: React.ComponentType<P> }>;
  fallback?: React.ReactNode;
  props?: P;
  watchKey?: string;
}

export const CakeLazy = <P extends object = Record<string, never>>({
  minTier = "rich",
  feature,
  loader,
  fallback = null,
  props,
  watchKey
}: CakeLazyProps<P>) => {
  const { tier, features, ready } = useCake();
  const allowed = isCakeAllowed(tier, features, { feature, minTier });
  const { downgrade } = useCakeWatchtower(watchKey);
  const showPrimary = ready && allowed && !downgrade;

  const LazyComponent = React.useMemo((): React.LazyExoticComponent<React.ComponentType<P>> | null => {
    if (!allowed || downgrade) {
      return null;
    }
    return React.lazy(loader);
  }, [allowed, downgrade, loader]);

  if (!ready || !allowed || !LazyComponent) {
    if (watchKey && fallback) {
      return (
        <CakeWatchSwap showPrimary={false} primary={null} fallback={fallback} />
      );
    }
    return fallback as React.ReactElement | null;
  }

  const primary = showPrimary ? (
    <React.Suspense fallback={fallback}>
      {React.createElement(
        LazyComponent as unknown as React.ComponentType<P>,
        props ?? ({} as P)
      )}
    </React.Suspense>
  ) : null;

  if (watchKey && fallback) {
    return <CakeWatchSwap showPrimary={showPrimary} primary={primary} fallback={fallback} />;
  }

  return primary;
};
