<script>
  import { ICONS } from "../lib/icons.js";
  import { settings } from "../lib/settings.svelte.js";
  import { isOpen, openBookmark } from "../lib/tabs.svelte.js";
</script>

<div id="bookmarks" data-count={settings.bookmarks.length}>
  {#each settings.bookmarks as bookmark (bookmark.url)}
    {@const Icon = ICONS[bookmark.icon] ?? ICONS.globe}
    <button
      class="bookmark {bookmark.favicon ? '' : `accent-${bookmark.color}`}"
      class:open={isOpen(bookmark)}
      title={bookmark.url}
      onclick={() => openBookmark(bookmark)}
    >
      {#if bookmark.favicon}
        <img src={bookmark.favicon} alt="" draggable="false" />
      {:else}
        <Icon />
      {/if}
    </button>
  {/each}
</div>
