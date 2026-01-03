<script lang="ts">
  import { onDestroy } from "svelte";
  import { setContext } from "svelte";
  import { readable, writable, type Readable } from "svelte/store";
  import type { CakeBootstrap, CakeConfig, CakeState, CakeTier } from "@birthday-cake-loading/core";
  import { createCakeRuntime } from "@birthday-cake-loading/core/runtime";
  import { applyCakeDatasetAttributes } from "@birthday-cake-loading/core/dom";
  import { BCL_CONTEXT_KEY, type CakeSvelteContext } from "./context";

  export let bootstrap: CakeBootstrap | undefined = undefined;
  export let config: Partial<CakeConfig> | undefined = undefined;
  export let autoDetect: boolean = true;
  export let watchSignals: boolean | undefined = undefined;
  export let applyHtmlDataset: boolean = true;
  export let onChange: ((state: CakeState) => void) | undefined = undefined;

  const initial: CakeState = {
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

  const stateWritable = writable<CakeState>(initial);

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

  let unsubscribeDataset: (() => void) | undefined;
  if (typeof window !== "undefined" && applyHtmlDataset) {
    applyCakeDatasetAttributes(runtime.getState());
    unsubscribeDataset = runtime.subscribe((s) => applyCakeDatasetAttributes(s));
  }

  const ctx: CakeSvelteContext = {
    state: readable(runtime.getState(), (set) => {
      const unsub = runtime.subscribe(set);
      return () => unsub();
    }) as Readable<CakeState>,
    refresh: () => runtime.refresh(),
    setTierOverride: (tier?: CakeTier) => runtime.setTierOverride(tier)
  };

  setContext(BCL_CONTEXT_KEY, ctx);

  onDestroy(() => {
    unsubscribeDataset?.();
    runtime.destroy();
  });
</script>

<slot />

