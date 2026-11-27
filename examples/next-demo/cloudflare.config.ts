import { bindings, defineConfig, defineWorker } from "cf/config";

// Installation-specific values come from the environment (Workers Builds
// build variables or a local .env), never from this file.
//   BCL_DEMO_WORKER_NAME  Worker name (default: birthday-cake-loading-demo)
//   BCL_DEMO_HOSTNAME     Custom domain to serve the demo on. When set,
//                         the workers.dev address is turned off.
const hostname = process.env.BCL_DEMO_HOSTNAME?.trim();

export default defineConfig({
  worker: defineWorker({
    name: process.env.BCL_DEMO_WORKER_NAME?.trim() || "birthday-cake-loading-demo",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-25",
    domains: hostname ? [hostname] : [],
    workersDev: !hostname,
    previewUrls: false,
    observability: {
      enabled: true,
      logs: { enabled: true, invocationLogs: true },
      issues: { enabled: true }
    },
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"]
    },
    env: {
      ASSETS: bindings.assets()
    }
  })
});
