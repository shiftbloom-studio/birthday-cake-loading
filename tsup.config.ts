import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: true
} as const;

export default defineConfig([
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      upgrade: "src/upgrade.tsx",
      devtools: "src/devtools.tsx"
    },
    clean: true
  },
  {
    ...shared,
    entry: {
      server: "src/server.ts"
    },
    clean: false
  }
]);
