import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@birthday-cake-loading/core",
    "@birthday-cake-loading/core/server",
    "@birthday-cake-loading/core/runtime",
    "@birthday-cake-loading/core/dom"
  ]
} as const;

export default defineConfig([
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      upgrade: "src/upgrade.tsx",
      devtools: "src/devtools.tsx"
    }
  }
]);

