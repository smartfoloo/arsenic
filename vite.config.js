import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  // Keep the dependency scanner out of the legacy app in old/.
  optimizeDeps: { entries: ["index.html"] },
});
