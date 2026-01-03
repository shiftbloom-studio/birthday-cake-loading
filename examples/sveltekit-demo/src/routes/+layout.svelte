<script lang="ts">
  import { CakeProvider } from "@birthday-cake-loading/sveltekit";
  export let data: { bootstrap?: unknown };
</script>

<CakeProvider bootstrap={data.bootstrap as any}>
  <slot />
</CakeProvider>

