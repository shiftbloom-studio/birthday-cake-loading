import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      middleware: "src/middleware.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: true,
    external: ["astro", "astro:middleware", "@birthday-cake-loading/core", "@birthday-cake-loading/core/server"]
  }
]);

