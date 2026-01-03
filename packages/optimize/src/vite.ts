import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

export interface BclOptimizeViteOptions {
  /**
   * Default: false (opt-in)
   */
  enabled?: boolean;
  /**
   * Project root to inspect for package.json.\n
   * Default: process.cwd()
   */
  root?: string;
}

const readPkg = (root: string) => {
  try {
    const raw = fs.readFileSync(path.join(root, "package.json"), "utf8");
    return JSON.parse(raw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  } catch {
    return {};
  }
};

/**
 * Optional Vite plugin:\n
 * - detects presence of common heavy libs\n
 * - currently does NOT auto-alias/shim by default (safety)\n
 *
 * This is a scaffold for future auto-optimization. Prefer wrapper imports today.\n
 */
export const bclOptimizeVite = (options: BclOptimizeViteOptions = {}): Plugin => {
  const enabled = Boolean(options.enabled);
  const root = options.root ?? process.cwd();

  return {
    name: "@birthday-cake-loading/optimize",
    enforce: "pre",
    config() {
      if (!enabled) return;
      const pkg = readPkg(root);
      const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

      const present = (name: string) => typeof deps[name] === "string";
      const found = [
        present("framer-motion") ? "framer-motion" : null,
        present("gsap") ? "gsap" : null,
        present("@react-three/fiber") || present("three") ? "three/r3f" : null,
        present("swiper") ? "swiper" : null
      ].filter(Boolean);

      // eslint-disable-next-line no-console
      console.info("[birthday-cake-loading/optimize] detected:", found.join(", ") || "none");
    }
  };
};

