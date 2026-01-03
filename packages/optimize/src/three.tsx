import React from "react";
import type { CakeTier } from "@birthday-cake-loading/react";
import { tierAtLeast, useCakeTier } from "@birthday-cake-loading/react";

export interface BclR3FCanvasProps {
  minTier?: CakeTier;
  fallback?: React.ReactNode;
  /**
   * Props forwarded to R3F Canvas when enabled.
   */
  canvasProps?: Record<string, unknown>;
  children?: React.ReactNode;
}

/**
 * React Three Fiber wrapper:\n
 * - base/lite: renders `fallback`\n
 * - rich/ultra (default minTier=ultra): lazy-loads `@react-three/fiber` Canvas\n
 */
export const BclR3FCanvas = ({
  minTier = "ultra",
  fallback = null,
  canvasProps,
  children
}: BclR3FCanvasProps) => {
  const tier = useCakeTier();
  const allowed = tierAtLeast(tier, minTier);

  const LazyCanvas = React.useMemo(
    () =>
      React.lazy(async () => {
        // @ts-expect-error - optional peer dependency
        const mod: any = await import("@react-three/fiber");
        return { default: mod.Canvas };
      }),
    []
  );

  if (!allowed) {
    return fallback as React.ReactElement | null;
  }

  return (
    <React.Suspense fallback={fallback}>
      {React.createElement(LazyCanvas as unknown as React.ComponentType<any>, canvasProps ?? {}, children)}
    </React.Suspense>
  );
};

