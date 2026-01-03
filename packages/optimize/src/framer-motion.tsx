import React from "react";
import { useCakeFeatures } from "@birthday-cake-loading/react";

type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

const lazyMotionTag = (tag: string) =>
  React.lazy(async () => {
    // @ts-expect-error - optional peer dependency
    const fm: any = await import("framer-motion");
    return { default: fm.motion?.[tag] ?? tag };
  });

/**
 * Minimal tier-aware wrappers for Framer Motion.\n
 * - If `features.motion` is false, these render plain DOM elements.\n
 * - If true, they lazy-load `framer-motion` and render `motion.*`.\n
 *
 * Notes:\n
 * - This intentionally avoids importing `framer-motion` at module load time.\n
 * - The fallback while the motion bundle loads is a plain element.\n
 */
export const BclMotionDiv = (props: AnyProps) => {
  const { motion } = useCakeFeatures();
  const Fallback = React.createElement("div", props as any);
  if (!motion) return Fallback;

  const MotionDiv = React.useMemo(() => lazyMotionTag("div"), []);
  return <React.Suspense fallback={Fallback}>{React.createElement(MotionDiv, props as any)}</React.Suspense>;
};

export const BclMotionSpan = (props: AnyProps) => {
  const { motion } = useCakeFeatures();
  const Fallback = React.createElement("span", props as any);
  if (!motion) return Fallback;

  const MotionSpan = React.useMemo(() => lazyMotionTag("span"), []);
  return <React.Suspense fallback={Fallback}>{React.createElement(MotionSpan, props as any)}</React.Suspense>;
};

