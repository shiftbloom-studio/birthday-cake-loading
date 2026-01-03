<script context="module" lang="ts">
  export type CakeUpgradeStrategy =
    | "immediate"
    | "idle"
    | "visible"
    | "interaction"
    | { type: "timeout"; ms: number }
    | { type: "idle"; timeoutMs?: number }
    | { type: "visible"; rootMargin?: string; threshold?: number | number[] };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import type { CakeFeatureKey, CakeTier } from "@birthday-cake-loading/core";
  import { tierAtLeast } from "@birthday-cake-loading/core";
  import { getCakeContext } from "./context";

  export let minTier: CakeTier = "rich";
  export let feature: CakeFeatureKey | undefined = undefined;
  export let loader: () => Promise<{ default: any }>;
  export let strategy: CakeUpgradeStrategy = "idle";

  const { state } = getCakeContext();

  let triggered = false;
  let Component: any = null;
  let target: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  const normalize = (s: CakeUpgradeStrategy) => {
    if (typeof s === "string") {
      return s;
    }
    return s.type;
  };

  const type = () => normalize(strategy);

  const shouldAllow = () => {
    if (!$state.ready) return false;
    return feature ? $state.features[feature] : tierAtLeast($state.tier, minTier);
  };

  const load = async () => {
    if (Component) return;
    const mod = await loader();
    Component = mod.default;
  };

  const trigger = async () => {
    triggered = true;
    await load();
  };

  const setup = () => {
    cleanup?.();
    cleanup = null;
    triggered = false;
    Component = null;

    if (!shouldAllow()) {
      return;
    }

    const s = normalize(strategy);
    if (s === "immediate") {
      void trigger();
      return;
    }

    if (s === "timeout") {
      const ms = typeof strategy === "object" && strategy.type === "timeout" ? strategy.ms : 0;
      const id = window.setTimeout(() => void trigger(), ms);
      cleanup = () => window.clearTimeout(id);
      return;
    }

    if (s === "idle") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyWindow = window as any;
      if (typeof anyWindow.requestIdleCallback === "function") {
        const timeoutMs =
          typeof strategy === "object" && strategy.type === "idle" ? strategy.timeoutMs : undefined;
        const idleId = anyWindow.requestIdleCallback(() => void trigger(), { timeout: timeoutMs });
        cleanup = () => anyWindow.cancelIdleCallback?.(idleId);
        return;
      }
      const id = window.setTimeout(() => void trigger(), 1);
      cleanup = () => window.clearTimeout(id);
      return;
    }

    if (s === "visible") {
      if (!target) return;
      if (typeof IntersectionObserver === "undefined") {
        void trigger();
        return;
      }
      const opts =
        typeof strategy === "object" && strategy.type === "visible"
          ? { rootMargin: strategy.rootMargin, threshold: strategy.threshold }
          : undefined;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            void trigger();
            observer.disconnect();
          }
        },
        opts
      );
      observer.observe(target);
      cleanup = () => observer.disconnect();
      return;
    }

    // interaction: handled in markup via events
  };

  // Re-run when gate changes.
  $: if (typeof window !== "undefined") setup();

  onDestroy(() => cleanup?.());
</script>

{#if $state.ready && (feature ? $state.features[feature] : tierAtLeast($state.tier, minTier)) && (type() === "immediate" || triggered) && Component}
  <svelte:component this={Component} />
{:else}
  {#if type() === "interaction"}
    <button
      type="button"
      on:pointerover={() => void trigger()}
      on:pointerdown={() => void trigger()}
      on:touchstart={() => void trigger()}
      on:focus={() => void trigger()}
      on:click={() => void trigger()}
    >
      <slot name="fallback" />
    </button>
  {:else if type() === "visible"}
    <div bind:this={target}>
      <slot name="fallback" />
    </div>
  {:else}
    <slot name="fallback" />
  {/if}
{/if}

