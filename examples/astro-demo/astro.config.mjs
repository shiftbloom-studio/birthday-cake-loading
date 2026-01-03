import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import birthdayCakeLoading from "@birthday-cake-loading/astro";

export default defineConfig({
  integrations: [react(), birthdayCakeLoading()]
});

