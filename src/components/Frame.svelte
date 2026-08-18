<script>
  import { backendOf, cacheBookmarkIcon, tabById, ui } from "../lib/tabs.svelte.js";
  import { faviconFor, inlineIcon, titleFor } from "../lib/url.js";

  const POLL_MS = 500;

  // Only the id is passed in: the tab itself is looked up from the store, so
  // this component never writes to a prop, and a tab that's been closed
  // mid-update simply reads as undefined instead of throwing.
  let { id } = $props();
  let el = $state();
  let iconSrc;
  let iconPending = false;

  const tab = $derived(tabById(id));
  const backend = $derived(tab && backendOf(tab));
  const active = $derived(!!tab?.url && tab.id === ui.activeId);

  $effect(() => {
    if (tab) tab.el = el;
  });

  $effect(() => {
    if (!tab?.request) return;

    iconSrc = null;
    go(tab.request.url);
  });

  // Pages stream, redirect and navigate on their own, and plenty never finish
  // loading at all, so the frame is polled while it's the one on screen.
  $effect(() => {
    if (!active) return;

    const timer = setInterval(read, POLL_MS);

    return () => clearInterval(timer);
  });

  async function go(url) {
    try {
      await backend.ready();
      if (!tab) return; // closed while the backend was still connecting

      tab.handle ??= backend.attach(el);
      backend.go(tab.handle, url);
    } catch (error) {
      console.error(error);
    }
  }

  /** Pull the address, title and icon out of whatever the frame is showing. */
  function read() {
    if (!tab) return;

    let href, doc;
    try {
      href = el.contentWindow.location.href;
      doc = el.contentDocument;
    } catch {
      return;
    }
    if (!doc) return;

    // A redirect can leave the frame on a URL that's been proxied more than
    // once, so unwrap until what's left is the real address.
    const proxied = location.origin + backend.prefix;
    let url = href;
    for (let depth = 0; depth < 5 && url.startsWith(proxied); depth++) url = backend.decode(url);
    if (!/^https?:/.test(url) || url.startsWith(proxied)) return;

    tab.url = url;
    tab.title = doc.title || titleFor(url);

    const src = faviconFor(backend, doc, url);
    if (src === iconSrc || iconPending) return;

    iconPending = true;
    inlineIcon(el.contentWindow, src)
      .then((icon) => {
        iconSrc = src;
        tab.favicon = icon;
        cacheBookmarkIcon(url, icon);
      })
      .catch(() => {}) // frame wasn't ready; the next poll picks it up
      .finally(() => (iconPending = false));
  }
</script>

<iframe bind:this={el} class:active title={tab?.title} referrerpolicy="no-referrer" onload={read}
></iframe>
