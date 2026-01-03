<script lang="ts">import { tierAtLeast } from "@birthday-cake-loading/core";
import { getCakeContext } from "./context";
export let minTier = "rich";
export let feature = undefined;
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

