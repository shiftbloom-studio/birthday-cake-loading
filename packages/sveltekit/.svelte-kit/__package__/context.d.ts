import type { Readable } from "svelte/store";
import type { CakeState, CakeTier } from "@birthday-cake-loading/core";
export type CakeSvelteContext = {
    state: Readable<CakeState>;
    refresh: () => void;
    setTierOverride: (tier?: CakeTier) => void;
};
export declare const BCL_CONTEXT_KEY: unique symbol;
export declare const getCakeContext: () => CakeSvelteContext;
