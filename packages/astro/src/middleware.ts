import type { MiddlewareHandler } from "astro";
import {
  getClientHintsHeaders,
  getServerCakeBootstrapFromHeadersIfPresent
} from "@birthday-cake-loading/core/server";

const trySetHeaders = (response: Response, headers: Record<string, string>) => {
  try {
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }
    return response;
  } catch {
    const cloned = new Response(response.body, response);
    for (const [k, v] of Object.entries(headers)) {
      cloned.headers.set(k, v);
    }
    return cloned;
  }
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Baseline-first SSR: only compute bootstrap if hints are present.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (context.locals as any).bcl = (context.locals as any).bcl || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (context.locals as any).bcl.bootstrap = getServerCakeBootstrapFromHeadersIfPresent(
    context.request.headers
  );

  const response = await next();
  return trySetHeaders(response, getClientHintsHeaders());
};

