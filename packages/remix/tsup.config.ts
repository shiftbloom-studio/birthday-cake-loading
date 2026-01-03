import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    clean: true,
    external: ["@remix-run/node", "@remix-run/react", "react", "react-dom", "@birthday-cake-loading/core/server"]
  }
]);

