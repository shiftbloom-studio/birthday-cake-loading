import { derived } from "svelte/store";
import { getCakeContext } from "./context";

export const useCake = () => getCakeContext().state;
export const useCakeTier = () => derived(getCakeContext().state, (s) => s.tier);
export const useCakeFeatures = () => derived(getCakeContext().state, (s) => s.features);
export const useCakeSignals = () => derived(getCakeContext().state, (s) => s.signals);
export const useCakeReady = () => derived(getCakeContext().state, (s) => s.ready);

