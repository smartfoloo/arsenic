<script>
  import PanelLeft from "@lucide/svelte/icons/panel-left";

  import Frame from "./Frame.svelte";
  import SettingsPage from "./SettingsPage.svelte";
  import StartPage from "./StartPage.svelte";
  import { tabs, ui } from "../lib/tabs.svelte.js";
</script>

<main id="content">
  <button
    class="iconbtn"
    id="floatToggle"
    title="Show sidebar"
    onclick={() => (ui.collapsed = !ui.collapsed)}
  >
    <PanelLeft />
  </button>

  <div id="frames">
    {#each tabs as tab (tab.id)}
      <Frame id={tab.id} />
    {/each}
  </div>

  <StartPage />
  <SettingsPage />
</main>
