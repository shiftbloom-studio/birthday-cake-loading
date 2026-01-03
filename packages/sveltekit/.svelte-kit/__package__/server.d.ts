import type { Handle } from "@sveltejs/kit";
import type { CakeConfig } from "@birthday-cake-loading/core";
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
/**
 * SvelteKit `handle` helper:\n
 * - computes SSR bootstrap from Client Hints (if present)\n
 * - stores it in `event.locals.bcl.bootstrap`\n
 * - sets response headers to request Client Hints\n
 */
export declare const handleBirthdayCakeLoading: (opts?: SvelteKitCakeOptions) => Handle;
