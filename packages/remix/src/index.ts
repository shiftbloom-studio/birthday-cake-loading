import type { HeadersFunction } from "@remix-run/node";
import type { CakeBootstrap } from "@birthday-cake-loading/core";
import {
  getClientHintsHeaders,
  getServerCakeBootstrapFromHeadersIfPresent
} from "@birthday-cake-loading/core/server";

/**
 * Remix helper: compute BCL bootstrap from the incoming request headers.
 * Use in your root `loader`.
 */
export const getRemixCakeBootstrapFromRequest = (request: Request): CakeBootstrap | undefined =>
  getServerCakeBootstrapFromHeadersIfPresent(request.headers);

/**
 * Remix helper: add Client Hint request headers in your root `headers` export.
 *
 * Example:
 * ```ts
 * export const headers = composeRemixHeaders([bclClientHintsHeaders()]);
 * ```
 */
export const bclClientHintsHeaders = (): HeadersFunction => () => {
  const h = getClientHintsHeaders();
  return new Headers(h);
};

/**
 * Compose multiple Remix `headers` functions into one.
 */
export const composeRemixHeaders =
  (fns: HeadersFunction[]): HeadersFunction =>
  (args) => {
    const out = new Headers();
    for (const fn of fns) {
      const next = fn(args);
      const hdrs = next instanceof Headers ? next : new Headers(next as any);
      hdrs.forEach((v, k) => out.set(k, v));
    }
    return out;
  };

