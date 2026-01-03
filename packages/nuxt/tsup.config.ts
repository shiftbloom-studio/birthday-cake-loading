import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      module: "src/module.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: true,
    external: ["nuxt", "vue", "@nuxt/kit", "@birthday-cake-loading/core"]
  },
  {
    entry: {
      "runtime/index": "runtime/index.ts",
      "runtime/plugin": "runtime/plugin.ts",
      "runtime/server-middleware": "runtime/server-middleware.ts",
      "runtime/composables": "runtime/composables.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: false,
    external: [
      "nuxt",
      "vue",
      "@birthday-cake-loading/core",
      "@birthday-cake-loading/core/server",
      "@birthday-cake-loading/core/runtime",
      "@birthday-cake-loading/core/dom",
      "h3",
      "#app",
      "#imports"
    ]
  }
]);

