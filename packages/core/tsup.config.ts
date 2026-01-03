import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  clean: true
} as const;

export default defineConfig([
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      server: "src/server.ts",
      runtime: "src/runtime.ts",
      dom: "src/dom.ts"
    }
  }
]);

