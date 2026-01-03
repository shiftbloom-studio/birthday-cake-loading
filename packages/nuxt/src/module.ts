import { addPlugin, addServerHandler, createResolver, defineNuxtModule } from "@nuxt/kit";

export interface BirthdayCakeLoadingNuxtOptions {
  /**
   * Enable auto Client Hints headers + SSR bootstrap middleware.
   *
   * Default: true
   */
  clientHints?: boolean;
  /**
   * If true, the module will write `data-bcl-*` attributes on `<html>` (client-side).
   *
   * Default: true
   */
  applyHtmlDataset?: boolean;
}

export default defineNuxtModule<BirthdayCakeLoadingNuxtOptions>({
  meta: {
    name: "@birthday-cake-loading/nuxt",
    configKey: "birthdayCakeLoading"
  },
  defaults: {
    clientHints: true,
    applyHtmlDataset: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Runtime plugin: exposes composables and provides the runtime state.
    addPlugin({
      src: resolver.resolve("../runtime/plugin"),
      mode: "all",
      options: {
        applyHtmlDataset: options.applyHtmlDataset !== false
      }
    });

    // Optional: server middleware that runs on every request.
    if (options.clientHints !== false) {
      addServerHandler({
        handler: resolver.resolve("../runtime/server-middleware"),
        middleware: true
      });
    }

    // Ensure Nuxt transpiles our runtime entry for different targets.
    nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    nuxt.options.build.transpile.push("@birthday-cake-loading/nuxt/runtime");
  }
});

