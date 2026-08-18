<script>
  import Search from "@lucide/svelte/icons/search";
  import Star from "@lucide/svelte/icons/star";

  import { settings } from "../lib/settings.svelte.js";
  import { activeTab, activeUrl, isBookmarked, open, toggleBookmark } from "../lib/tabs.svelte.js";
  import { resolve } from "../lib/url.js";

  let input = $state();
  let focused = $state(false);

  const url = $derived(activeUrl());
  const kind = $derived(activeTab()?.kind);
  const shown = $derived(kind && kind !== "proxy" ? `arsenic://${kind}` : (url ?? ""));

  // Leave whatever's being typed alone; put the real address back on blur.
  $effect(() => {
    if (!focused) input.value = shown;
  });

  function keydown(event) {
    if (event.key === "Enter") {
      const target = resolve(input.value, settings.search);
      if (target) open(target);
      input.blur();
    }
    if (event.key === "Escape") input.blur();
  }

  function shortcut(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "l") {
      event.preventDefault();
      input.focus();
    }
  }
</script>

<svelte:window onkeydown={shortcut} />

<div id="urlbar">
  <Search />
  <input
    id="urlInput"
    spellcheck="false"
    placeholder="Search or enter address"
    bind:this={input}
    onkeydown={keydown}
    onfocus={() => {
      focused = true;
      input.select();
    }}
    onblur={() => (focused = false)}
  />
  <button
    class="iconbtn"
    id="bookmarkBtn"
    title="Bookmark this page"
    class:active={isBookmarked(url)}
    disabled={!url}
    onclick={() => toggleBookmark(url)}
  >
    <Star />
  </button>
</div>
