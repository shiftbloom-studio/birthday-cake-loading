<script lang="ts">
  import { useCakeFeatures, useCakeTier } from "@birthday-cake-loading/sveltekit";

  const tier = useCakeTier();
  const features = useCakeFeatures();
</script>

<main style="font-family: system-ui; padding: 24px; max-width: 720px; margin: 0 auto;">
  <h1>Birthday-Cake Loading — SvelteKit demo</h1>
  <p>Tier: <strong>{$tier}</strong></p>
  <ul>
    <li>motion: {String($features.motion)}</li>
    <li>audio: {String($features.audio)}</li>
    <li>richImages: {String($features.richImages)}</li>
  </ul>
</main>

