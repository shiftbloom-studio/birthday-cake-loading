import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: [
    "react",
    "react-dom",
    "@birthday-cake-loading/react",
    "@birthday-cake-loading/react/upgrade",
    "@birthday-cake-loading/react/devtools",
    "@birthday-cake-loading/core/server"
  ]
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
