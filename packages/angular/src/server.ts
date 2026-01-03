import type { IncomingHttpHeaders } from "node:http";
import type { CakeBootstrap } from "@birthday-cake-loading/core";
import {
  getClientHintsHeaders,
  getServerCakeBootstrapFromHeadersIfPresent
} from "@birthday-cake-loading/core/server";

/**
 * Node/Express-style helper for Angular Universal SSR.\n
 * - sets response headers to request Client Hints\n
 * - computes a baseline-first bootstrap (only if hints are present)\n
 */
export const getAngularUniversalBootstrapFromHeaders = (
  headers: IncomingHttpHeaders | Headers | Record<string, any>
): CakeBootstrap | undefined =>
  getServerCakeBootstrapFromHeadersIfPresent(headers as any);

export const getAngularUniversalClientHintsHeaders = () => getClientHintsHeaders();

/**
 * Express middleware that sets Client Hints headers on every request.
 * (Compatible with Angular Universal setups that use Express.)
 */
export const bclExpressClientHintsMiddleware =
  () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_req: any, res: any, next: any) => {
    const headers = getClientHintsHeaders();
    for (const [k, v] of Object.entries(headers)) {
      try {
        res.setHeader(k, v);
      } catch {
        // ignore
      }
    }
    next();
  };

