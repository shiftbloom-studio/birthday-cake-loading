<script lang="ts">import { onDestroy } from "svelte";
import { setContext } from "svelte";
import { readable, writable } from "svelte/store";
import { createCakeRuntime } from "@birthday-cake-loading/core/runtime";
import { applyCakeDatasetAttributes } from "@birthday-cake-loading/core/dom";
import { BCL_CONTEXT_KEY } from "./context";
export let bootstrap = undefined;
export let config = undefined;
export let autoDetect = true;
export let watchSignals = undefined;
export let applyHtmlDataset = true;
export let onChange = undefined;
const initial = {
    signals: {},
    tier: "base",
    features: {
        motion: false,
        smoothScroll: false,
        audio: false,
        privacyBanner: false,
        richImages: false
    },
    ready: false
};
const stateWritable = writable(initial);
const runtime = createCakeRuntime({
    config,
    bootstrap,
    autoDetect,
    watchSignals,
    onChange: (s) => {
        stateWritable.set(s);
        onChange?.(s);
    }
});
// sync initial state
stateWritable.set(runtime.getState());
let unsubscribeDataset;
if (typeof window !== "undefined" && applyHtmlDataset) {
    applyCakeDatasetAttributes(runtime.getState());
    unsubscribeDataset = runtime.subscribe((s) => applyCakeDatasetAttributes(s));
}
const ctx = {
    state: readable(runtime.getState(), (set) => {
        const unsub = runtime.subscribe(set);
        return () => unsub();
    }),
    refresh: () => runtime.refresh(),
    setTierOverride: (tier) => runtime.setTierOverride(tier)
};
setContext(BCL_CONTEXT_KEY, ctx);
onDestroy(() => {
    unsubscribeDataset?.();
    runtime.destroy();
});
</script>

<slot />

