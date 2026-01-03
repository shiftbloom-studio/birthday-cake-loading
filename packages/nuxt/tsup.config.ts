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
      "runtime/index": "runtime/index.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: false,
    external: ["nuxt", "vue", "@birthday-cake-loading/core"]
  }
]);

