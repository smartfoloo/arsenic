<script>
  import { backendOf, cacheBookmarkIcon, tabById, ui } from "../lib/tabs.svelte.js";
  import { wispUrl } from "../lib/backends.js";
  import { faviconFor, inlineIcon, titleFor } from "../lib/url.js";
  import { settings } from "../lib/settings.svelte.js";

  const POLL_MS = 500;

  // Set only in the static build (see vite.static.config.mjs). Scramjet's
  // service worker can only intercept traffic for its own origin, so a page
  // dropped on an arbitrary static host can't run the proxy locally the way
  // the main app does — instead this loads server/embed/embed.svg, which
  // runs Scramjet on an origin you control, and talks to it over
  // postMessage. See that file's own header comment for the wire protocol.
  // Empty here means the main app's normal same-origin path, unchanged.
  const EMBED_BASE = (import.meta.env.VITE_EMBED_BASE_URL ?? "").replace(/\/$/, "");

  // Only the id is passed in: the tab itself is looked up from the store, so
  // this component never writes to a prop, and a tab that's been closed
  // mid-update simply reads as undefined instead of throwing.
  let { id } = $props();
  let el = $state();
  let iconSrc;
  let iconPending = false;
  let embedReady = false;
  let pendingUrl;

  const tab = $derived(tabById(id));
  const backend = $derived(tab && backendOf(tab));
  const active = $derived(!!tab?.url && tab.id === ui.activeId);

  $effect(() => {
    if (tab) tab.el = el;
  });

  $effect(() => {
    if (!tab?.request) return;

    iconSrc = null;
    if (EMBED_BASE) goEmbed(tab.request.url);
    else go(tab.request.url);
  });

  // Pages stream, redirect and navigate on their own, and plenty never finish
  // loading at all, so the frame is polled while it's the one on screen.
  // Only for the main app — the embed bridge pushes nav updates itself
  // (relay() in embed.svg), and el.contentDocument is cross-origin there
  // anyway, so polling it would just silently fail every tick.
  $effect(() => {
    if (!active || EMBED_BASE) return;

    const timer = setInterval(read, POLL_MS);

    return () => clearInterval(timer);
  });

  $effect(() => {
    if (!EMBED_BASE || !tab) return;

    function onMessage(event) {
      if (event.source !== el?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "ready") {
        embedReady = true;
        if (pendingUrl) postToEmbed({ type: "frame", action: "go", url: pendingUrl });
        pendingUrl = undefined;
      } else if (data.type === "nav") {
        tab.url = data.url;
        tab.title = data.title || titleFor(data.url);
        if (data.favicon) {
          tab.favicon = data.favicon;
          cacheBookmarkIcon(data.url, data.favicon);
        }
      } else if (data.type === "error") {
        console.error("embed:", data.message);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });

  function postToEmbed(message) {
    el?.contentWindow?.postMessage(message, "*");
  }

  function goEmbed(url) {
    // tab.embedPost lets shared code (tabs.svelte.js's reload(), inspect.js)
    // reach this specific iframe without needing to know it's cross-origin —
    // same idea as tab.el, just for the one thing tab.el can't do here.
    if (tab) tab.embedPost = postToEmbed;
    if (embedReady) postToEmbed({ type: "frame", action: "go", url });
    else pendingUrl = url;
  }

  async function go(url) {
    try {
      await backend.ready();
      if (!tab) return; // closed while the backend was still connecting

      tab.handle ??= backend.attach(el, { youtubeAdblock: settings.youtubeAdblock });
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
    // once, so unwrap until what's left is the real address. Prefer the
    // frame's own prefix/decode over the backend's static ones — Scramjet v2
    // gives every frame its own randomized sub-prefix, unlike the single
    // flat one v1 and Ultraviolet use, so only the frame itself knows it.
    const proxied = location.origin + (tab.handle?.prefix ?? backend.prefix);
    let url = href;
    for (let depth = 0; depth < 5 && url.startsWith(proxied); depth++) {
      url = tab.handle?.decode ? tab.handle.decode(url) : backend.decode(url);
    }
    if (!/^https?:/.test(url) || url.startsWith(proxied)) return;

    tab.url = url;
    tab.title = doc.title || titleFor(url);

    const src = faviconFor(backend, doc, url, tab.handle);
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

  const embedSrc = EMBED_BASE ? `${EMBED_BASE}/embed.svg?wisp=${encodeURIComponent(wispUrl())}` : undefined;
</script>

<iframe bind:this={el} class:active title={tab?.title} referrerpolicy="no-referrer" src={embedSrc}
  onload={EMBED_BASE ? undefined : read}
></iframe>
