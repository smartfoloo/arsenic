<script>
  import Code from "@lucide/svelte/icons/code";
  import Maximize from "@lucide/svelte/icons/maximize";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Minimize from "@lucide/svelte/icons/minimize";
  import PanelLeft from "@lucide/svelte/icons/panel-left";
  import RotateCw from "@lucide/svelte/icons/rotate-cw";
  import Cog from "@lucide/svelte/icons/settings";
  import Sparkles from "@lucide/svelte/icons/sparkles";

  import Bookmarks from "./Bookmarks.svelte";
  import TabList from "./TabList.svelte";
  import UrlBar from "./UrlBar.svelte";
  import { aiStatus, checkAiEnabled } from "../lib/ai.svelte.js";
  import { BACKEND_OPTIONS, LOCATION_OPTIONS } from "../lib/backends.js";
  import { chat } from "../lib/chat.svelte.js";
  import { inspect } from "../lib/inspect.js";
  import { settings } from "../lib/settings.svelte.js";
  import { activeTab, activeUrl, openAiTab, openInternal, reload, ui } from "../lib/tabs.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  let fullscreen = $state(false);

  // AiPage now only mounts once an AI tab is open, so this is the one
  // always-mounted place left to learn whether the sidebar button shows.
  $effect(() => {
    checkAiEnabled();
  });

  // The wisp connection is shared and switches live, but a tab's already-
  // rendered content only actually moved over next time it loaded — so this
  // shows what the active tab was last loaded under, not the live setting,
  // and flags it stale when the two have since diverged.
  const location = $derived.by(() => {
    const tab = activeTab();
    // Same gate as locationStale: only a tab with something loaded has a
    // meaningful "location it was loaded under" to show instead of the
    // live setting.
    const name = tab?.kind === "proxy" && tab.url ? tab.locationName : settings.location;
    return LOCATION_OPTIONS.find(([value]) => value === name) ?? LOCATION_OPTIONS[0];
  });
  const locationStale = $derived.by(() => {
    const tab = activeTab();
    // Only a tab with something actually loaded can be out of sync — a
    // blank tab or an internal page (settings/chat) has nothing to reload.
    if (tab?.kind !== "proxy" || !tab.url) return false;

    return tab.locationName !== settings.location;
  });
  // Backend is genuinely per-tab (each tab keeps whatever it was opened
  // with), so this tracks the active tab — falling back to the default
  // setting on a blank/internal tab that has no backend of its own yet.
  const backend = $derived(
    BACKEND_OPTIONS.find(([value]) => value === (activeTab()?.backendName ?? settings.backend)) ??
      BACKEND_OPTIONS[0],
  );

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.getElementById("content").requestFullscreen();
  }
</script>

<svelte:document onfullscreenchange={() => (fullscreen = !!document.fullscreenElement)} />

<aside id="sidebar">
  <div class="navrow">
    <button class="iconbtn" id="toggleSidebar" aria-label="Hide sidebar" onclick={() => (ui.collapsed = !ui.collapsed)}>
      <PanelLeft />
    </button>

    <div id="statusStack">
      <span id="backendIndicator" title="This tab's backend, or the default for a new one">
        {backend[1]}
      </span>
      <span
        id="locationIndicator"
        class:stale={locationStale}
        title={locationStale
          ? `This tab loaded under a different location than the current setting (${location[1]}) — reload to move it over`
          : `Exit location: ${location[1]} — shared by every tab, change it in Settings`}
      >
        <span class="fi {location[3]} option-flag"></span>
      </span>
    </div>

    <button
      class="iconbtn"
      id="reload"
      class:stale={locationStale}
      aria-label="Reload"
      disabled={!activeUrl()}
      onclick={reload}
    >
      <RotateCw />
    </button>
    <button class="iconbtn" id="fullscreen" aria-label="Fullscreen" onclick={toggleFullscreen}>
      {#if fullscreen}<Minimize />{:else}<Maximize />{/if}
    </button>
  </div>

  <UrlBar />

  <Bookmarks />
  <div class="divider"></div>
  <TabList />

  <div id="footer">
    <button
      class="iconbtn"
      id="openSettings"
      aria-label="Settings"
      use:tooltip={"Settings"}
      onclick={() => openInternal("settings")}
    >
      <Cog />
    </button>
    {#if !chat.disabled}
      <button
        class="iconbtn"
        id="openChat"
        aria-label="Chat"
        use:tooltip={"Chat"}
        onclick={() => openInternal("chat")}
      >
        <MessageCircle />
      </button>
    {/if}
    {#if aiStatus.enabled}
      <button
        class="iconbtn"
        id="openAi"
        aria-label="AI"
        use:tooltip={"AI"}
        onclick={() => openAiTab()}
      >
        <Sparkles />
      </button>
    {/if}
    <button
      class="iconbtn"
      id="devtools"
      aria-label="Inspect page"
      use:tooltip={"Inspect page"}
      disabled={!activeUrl()}
      onclick={() => inspect(activeTab())}
    >
      <Code />
    </button>
  </div>
</aside>
