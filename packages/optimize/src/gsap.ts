import React from "react";
import type { CakeTier } from "@birthday-cake-loading/react";
import { tierAtLeast, useCakeTier } from "@birthday-cake-loading/react";

/**
 * React hook: lazily import GSAP only when the tier allows it.\n
 * Returns `null` on base/lite.\n
 */
export const useGsap = (minTier: CakeTier = "rich") => {
  const tier = useCakeTier();
  const allowed = tierAtLeast(tier, minTier);
  const [gsap, setGsap] = React.useState<any>(null);

  React.useEffect(() => {
    if (!allowed) {
      setGsap(null);
      return;
    }
    let cancelled = false;
    // @ts-expect-error - optional peer dependency
    void import("gsap")
      .then((m: any) => {
        if (!cancelled) setGsap(m.gsap ?? m.default ?? m);
      })
      .catch(() => {
        if (!cancelled) setGsap(null);
      });
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  return gsap;
};

