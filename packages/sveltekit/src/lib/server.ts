import type { Handle } from "@sveltejs/kit";
import type { CakeConfig } from "@birthday-cake-loading/core";
import {
  getClientHintsHeaders,
  getServerCakeBootstrapFromHeadersIfPresent
} from "@birthday-cake-loading/core/server";

export interface SvelteKitCakeOptions {
  /**
   * If false, does not set Accept-CH / Permissions-Policy / Vary headers.
   *
   * Default: true
   */
  clientHints?: boolean;
  /**
   * Optional config, used only when computing server bootstrap tier/features.
   */
  config?: Partial<CakeConfig>;
}

const trySetHeaders = (response: Response, headers: Record<string, string>) => {
  try {
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }
    return response;
  } catch {
    // Response headers may be immutable (e.g. redirects).
    const cloned = new Response(response.body, response);
    for (const [k, v] of Object.entries(headers)) {
      cloned.headers.set(k, v);
    }
    return cloned;
  }
};

/**
 * SvelteKit `handle` helper:\n
 * - computes SSR bootstrap from Client Hints (if present)\n
 * - stores it in `event.locals.bcl.bootstrap`\n
 * - sets response headers to request Client Hints\n
 */
export const handleBirthdayCakeLoading =
  (opts: SvelteKitCakeOptions = {}): Handle =>
  async ({ event, resolve }) => {
    if (!event.locals.bcl) {
      event.locals.bcl = {};
    }

    event.locals.bcl.bootstrap = getServerCakeBootstrapFromHeadersIfPresent(
      event.request.headers,
      opts.config as any
    );

    const response = await resolve(event);

    if (opts.clientHints !== false) {
      const headers = getClientHintsHeaders();
      return trySetHeaders(response, headers);
    }

    return response;
  };

