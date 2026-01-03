<script lang="ts">
  import type { CakeFeatureKey, CakeTier } from "@birthday-cake-loading/core";
  import { tierAtLeast } from "@birthday-cake-loading/core";
  import { getCakeContext } from "./context";

  export let minTier: CakeTier = "rich";
  export let feature: CakeFeatureKey | undefined = undefined;

  const { state } = getCakeContext();
</script>

{#if !$state.ready}
  <slot name="fallback" />
{:else}
  {#if feature ? $state.features[feature] : tierAtLeast($state.tier, minTier)}
    <slot />
  {:else}
    <slot name="fallback" />
  {/if}
{/if}

