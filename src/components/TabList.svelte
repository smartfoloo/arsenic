<script>
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Cog from "@lucide/svelte/icons/settings";
  import X from "@lucide/svelte/icons/x";

  import { ICONS, iconForHost } from "../lib/icons.js";
  import { closeTab, focus, tabs, ui } from "../lib/tabs.svelte.js";
  import { hostOf } from "../lib/url.js";

  const INTERNAL_ICONS = { settings: Cog, chat: MessageCircle };
</script>

<div id="tablist">
  {#each tabs as tab (tab.id)}
    {@const Icon = INTERNAL_ICONS[tab.kind] ?? ICONS[iconForHost(hostOf(tab.url))]}
    <div
      class="tab"
      class:active={tab.id === ui.activeId}
      role="button"
      tabindex="0"
      onclick={() => focus(tab.id)}
      onkeydown={(event) => event.key === "Enter" && focus(tab.id)}
    >
      <div class="fav {tab.favicon || !tab.url ? 'bare' : `accent-${tab.color}`}">
        {#if tab.favicon}
          <img src={tab.favicon} alt="" draggable="false" />
        {:else}
          <Icon />
        {/if}
      </div>
      <div class="title">{tab.title}</div>
      <button
        class="close"
        title="Close tab"
        onclick={(event) => {
          event.stopPropagation();
          closeTab(tab.id);
        }}
      >
        <X />
      </button>
    </div>
  {/each}
</div>
