import { getContext } from "svelte";
export const BCL_CONTEXT_KEY = Symbol.for("birthday-cake-loading:sveltekit");
export const getCakeContext = () => {
    const ctx = getContext(BCL_CONTEXT_KEY);
    if (!ctx) {
        throw new Error("[birthday-cake-loading] Missing CakeProvider. Wrap your root layout with <CakeProvider>.");
    }
    return ctx;
};
