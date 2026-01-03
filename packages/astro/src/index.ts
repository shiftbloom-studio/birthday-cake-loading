import type { AstroIntegration } from "astro";

export interface BirthdayCakeLoadingAstroOptions {
  /**
   * Enable middleware that sets Client Hints response headers and computes
   * `context.locals.bcl.bootstrap` (when hints are present).
   *
   * Default: true
   */
  middleware?: boolean;
}

export default function birthdayCakeLoading(
  options: BirthdayCakeLoadingAstroOptions = {}
): AstroIntegration {
  return {
    name: "@birthday-cake-loading/astro",
    hooks: {
      "astro:config:setup": ({ addMiddleware }) => {
        if (options.middleware === false) {
          return;
        }
        addMiddleware({
          entrypoint: "@birthday-cake-loading/astro/middleware",
          order: "pre"
        });
      }
    }
  };
}

