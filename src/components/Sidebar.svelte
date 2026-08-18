<script>
  import Code from "@lucide/svelte/icons/code";
  import Maximize from "@lucide/svelte/icons/maximize";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Minimize from "@lucide/svelte/icons/minimize";
  import PanelLeft from "@lucide/svelte/icons/panel-left";
  import Plus from "@lucide/svelte/icons/plus";
  import RotateCw from "@lucide/svelte/icons/rotate-cw";
  import Cog from "@lucide/svelte/icons/settings";

  import Bookmarks from "./Bookmarks.svelte";
  import TabList from "./TabList.svelte";
  import UrlBar from "./UrlBar.svelte";
  import { chat } from "../lib/chat.svelte.js";
  import { inspect } from "../lib/inspect.js";
  import { activeTab, activeUrl, newTab, openInternal, reload, ui } from "../lib/tabs.svelte.js";

  let fullscreen = $state(false);

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
    <button class="iconbtn" id="newTab" title="New Tab" onclick={() => newTab()}>
      <Plus />
    </button>
  </div>
</aside>
