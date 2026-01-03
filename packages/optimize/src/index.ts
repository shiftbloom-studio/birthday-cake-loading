export type { CakeTier } from "@birthday-cake-loading/react";
export { tierAtLeast } from "@birthday-cake-loading/react";

export interface OptimizationAdapter {
  id: string;
  description: string;
}

const registry: OptimizationAdapter[] = [];

export const registerOptimization = (adapter: OptimizationAdapter) => {
  registry.push(adapter);
};

export const listOptimizations = () => registry.slice();

// Built-in adapter descriptors (wrappers are in subpath exports).
registerOptimization({
  id: "framer-motion",
  description: "React wrappers that only load framer-motion when motion is allowed."
});
registerOptimization({
  id: "gsap",
  description: "Conditional GSAP loader gated by tier/features."
});
registerOptimization({
  id: "three",
  description: "React wrappers for Three.js / React Three Fiber gated by tier."
});
registerOptimization({
  id: "swiper",
  description: "Tiered Swiper wrapper with a CSS-only scroll-snap fallback."
});

