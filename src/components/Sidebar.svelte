<script>
  import Code from "@lucide/svelte/icons/code";
  import Maximize from "@lucide/svelte/icons/maximize";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Minimize from "@lucide/svelte/icons/minimize";
  import PanelLeft from "@lucide/svelte/icons/panel-left";
  import RotateCw from "@lucide/svelte/icons/rotate-cw";
  import Cog from "@lucide/svelte/icons/settings";

  import Bookmarks from "./Bookmarks.svelte";
  import TabList from "./TabList.svelte";
  import UrlBar from "./UrlBar.svelte";
  import { BACKEND_OPTIONS, LOCATION_OPTIONS } from "../lib/backends.js";
  import { chat } from "../lib/chat.svelte.js";
  import { inspect } from "../lib/inspect.js";
  import { settings } from "../lib/settings.svelte.js";
  import { activeTab, activeUrl, openInternal, reload, ui } from "../lib/tabs.svelte.js";

  let fullscreen = $state(false);

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
    <button
      class="iconbtn"
      id="toggleSidebar"
      title="Hide sidebar"
      onclick={() => (ui.collapsed = !ui.collapsed)}
    >
      <PanelLeft />
    </button>
    <div class="spacer"></div>
    <button class="iconbtn" id="reload" title="Reload" disabled={!activeUrl()} onclick={reload}>
      <RotateCw />
    </button>
    <button class="iconbtn" id="fullscreen" title="Fullscreen" onclick={toggleFullscreen}>
      {#if fullscreen}<Minimize />{:else}<Maximize />{/if}
    </button>
  </div>

  <UrlBar />

  <Bookmarks />
  <div class="divider"></div>
  <TabList />

  <div id="statusRow">
    <span id="backendIndicator" title="This tab's backend, or the default for a new one">
      {backend[1]}
    </span>
    <span
      id="locationIndicator"
      class:stale={locationStale}
      title={locationStale
        ? "This tab loaded under a different location than the current setting — reload to move it over"
        : "Exit location — shared by every tab, change it in Settings"}
    >
      <span class="fi {location[3]} option-flag"></span>
      {location[1]}
    </span>
    <button
      id="locationReload"
      class:hidden={!locationStale}
      title="Reload to apply the current location"
      tabindex={locationStale ? 0 : -1}
      aria-hidden={!locationStale}
      onclick={reload}
    >
      <RotateCw />
    </button>
  </div>

  <div id="footer">
    <button class="iconbtn" id="openSettings" title="Settings" onclick={() => openInternal("settings")}>
      <Cog />
    </button>
    {#if !chat.disabled}
      <button class="iconbtn" id="openChat" title="Chat" onclick={() => openInternal("chat")}>
        <MessageCircle />
      </button>
    {/if}
    <button
      class="iconbtn"
      id="devtools"
      title="Inspect page"
      disabled={!activeUrl()}
      onclick={() => inspect(activeTab())}
    >
      <Code />
    </button>
  </div>
</aside>
