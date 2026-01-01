"use client";

import React, { Suspense, useMemo } from "react";
import type { CakeFeatureKey, CakeTier } from "./types";
import { useCake } from "./context";
import { tierAtLeast } from "./tier";

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
  const allowed = feature ? features[feature] : tierAtLeast(tier, minTier);

  if (!ready) {
    return fallback as React.ReactElement | null;
  }

  return allowed ? <>{children}</> : (fallback as React.ReactElement | null);
};

export interface CakeLazyProps {
  minTier?: CakeTier;
  feature?: CakeFeatureKey;
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

export const CakeLazy = ({
  minTier = "rich",
  feature,
  loader,
  fallback = null,
  props
}: CakeLazyProps) => {
  const { tier, features, ready } = useCake();
  const allowed = feature ? features[feature] : tierAtLeast(tier, minTier);

  const LazyComponent = useMemo(() => {
    if (!allowed) {
      return null;
    }
    return React.lazy(loader);
  }, [allowed, loader]);

  if (!ready || !allowed || !LazyComponent) {
    return fallback as React.ReactElement | null;
  }

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
