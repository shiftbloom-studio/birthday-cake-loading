import { getClientHintsHeaders, getServerCakeBootstrapFromHeadersIfPresent } from "@birthday-cake-loading/core/server";
const trySetHeaders = (response, headers) => {
    try {
        for (const [k, v] of Object.entries(headers)) {
            response.headers.set(k, v);
        }
        return response;
    }
    catch {
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
export const handleBirthdayCakeLoading = (opts = {}) => async ({ event, resolve }) => {
    if (!event.locals.bcl) {
        event.locals.bcl = {};
    }
    event.locals.bcl.bootstrap = getServerCakeBootstrapFromHeadersIfPresent(event.request.headers, opts.config);
    const response = await resolve(event);
    if (opts.clientHints !== false) {
        const headers = getClientHintsHeaders();
        return trySetHeaders(response, headers);
    }
    return response;
};
