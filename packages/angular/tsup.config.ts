import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      server: "src/server.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: true,
    external: [
      "@angular/core",
      "@angular/common",
      "@angular/platform-browser",
      "rxjs",
      "@birthday-cake-loading/core",
      "@birthday-cake-loading/core/runtime",
      "@birthday-cake-loading/core/dom",
      "@birthday-cake-loading/core/server"
    ]
  }
]);

