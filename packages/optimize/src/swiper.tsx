import React from "react";
import type { CakeTier } from "@birthday-cake-loading/react";
import { tierAtLeast, useCakeTier } from "@birthday-cake-loading/react";

export interface BclSwiperProps {
  minTier?: CakeTier;
  fallback?: React.ReactNode;
  /**
   * Items to render for the slider/carousel.\n
   * On base/lite these are rendered as a scroll-snap list.
   */
  children: React.ReactNode;
  /**
   * Props forwarded to Swiper when enabled.
   */
  swiperProps?: Record<string, unknown>;
}

/**
 * Tier-aware Swiper wrapper (React).\n
 * - base/lite: CSS-only horizontal scroll-snap fallback\n
 * - rich/ultra: lazy-loads `swiper/react` and renders `<Swiper>`\n
 *
 * Note: This does NOT auto-import Swiper CSS. Keep styles in your app.\n
 */
export const BclSwiper = ({ minTier = "rich", fallback, children, swiperProps }: BclSwiperProps) => {
  const tier = useCakeTier();
  const allowed = tierAtLeast(tier, minTier);

  const Fallback =
    fallback ??
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "80%",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 4
        }
      },
      React.Children.map(children, (c) =>
        React.createElement(
          "div",
          { style: { scrollSnapAlign: "start" } },
          c as React.ReactNode
        )
      )
    );

  const LazySwiper = React.useMemo(
    () =>
      React.lazy(async () => {
        // @ts-expect-error - optional peer dependency
        const mod: any = await import("swiper/react");
        return { default: mod.Swiper };
      }),
    []
  );

  if (!allowed) {
    return Fallback as React.ReactElement | null;
  }

  return (
    <React.Suspense fallback={Fallback}>
      {React.createElement(LazySwiper as unknown as React.ComponentType<any>, swiperProps ?? {}, children)}
    </React.Suspense>
  );
};

