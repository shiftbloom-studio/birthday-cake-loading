import React from "react";
import type { CakeFeatureKey, CakeTier } from "./types";
import { useCake } from "./context";
import { isCakeAllowed } from "./access";

export interface CakeLayerProps {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const CakeLayer = ({
  minTier = "rich",
  feature,
  fallback = null,
  children
}: CakeLayerProps) => {
  const { tier, features, ready } = useCake();
  const allowed = isCakeAllowed(tier, features, { feature, minTier });

  if (!ready) {
    return fallback as React.ReactElement | null;
  }

  return allowed ? <>{children}</> : (fallback as React.ReactElement | null);
};

export interface CakeLazyProps<P extends object = Record<string, never>> {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  loader: () => Promise<{ default: React.ComponentType<P> }>;
  fallback?: React.ReactNode;
  props?: P;
}

export const CakeLazy = <P extends object = Record<string, never>>({
  minTier = "rich",
  feature,
  loader,
  fallback = null,
  props
}: CakeLazyProps<P>) => {
  const { tier, features, ready } = useCake();
  const allowed = isCakeAllowed(tier, features, { feature, minTier });

  const LazyComponent = React.useMemo((): React.LazyExoticComponent<React.ComponentType<P>> | null => {
    if (!allowed) {
      return null;
    }
    return React.lazy(loader);
  }, [allowed, loader]);

  if (!ready || !allowed || !LazyComponent) {
    return fallback as React.ReactElement | null;
  }

  return (
    <React.Suspense fallback={fallback}>
      {React.createElement(
        LazyComponent as unknown as React.ComponentType<P>,
        props ?? ({} as P)
      )}
    </React.Suspense>
  );
};
