export const ENGINES = {
  duckduckgo: "https://duckduckgo.com/?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  yahoo: "https://search.yahoo.com/search?p=",
};

/** Turn address bar input into a URL, falling back to a search query. */
export function resolve(input, engine) {
  const q = input.trim();
  if (!q) return null;
  if (/^https?:\/\//i.test(q)) return q;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) && !q.includes(" ")) return `https://${q}`;

  return ENGINES[engine] + encodeURIComponent(q);
}

export function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function titleFor(url) {
  return hostOf(url)?.replace(/^www\./, "") ?? "New Tab";
}

/** The real (unproxied) URL of a page's icon. */
export function faviconFor(backend, doc, pageUrl) {
  const raw = doc.querySelector("link[rel~='icon']")?.getAttribute("href") || "/favicon.ico";
  if (raw.startsWith("data:")) return raw;
  // Some proxies hand back an href they already rewrote; undo that.
  if (raw.startsWith(backend.prefix)) return backend.decode(location.origin + raw);

  try {
    return new URL(raw, pageUrl).href;
  } catch {
    return null;
  }
}

const MAX_ICON_BYTES = 64 * 1024;
const ICON_TIMEOUT_MS = 5000;

/**
 * Inline an icon as a data URL. Only the frame is under the service worker's
 * scope, so the fetch has to be made from inside it — and inlining means the
 * icon keeps working in the sidebar, where nothing is proxied.
 *
 * Resolves to null when the page has no icon worth showing, and rejects when
 * the frame wasn't ready to serve it and the caller should try again. A page
 * that's still streaming can stall the request indefinitely, hence the timeout.
 */
export async function inlineIcon(frameWindow, src) {
  if (!src) return null;
  // Pages that don't want a favicon request often point at an empty `data:,`.
  if (src.startsWith("data:")) return src.startsWith("data:image/") ? src : null;

  // The frame's own controller, so the signal belongs to the realm fetching.
  const abort = new frameWindow.AbortController();
  setTimeout(() => abort.abort(), ICON_TIMEOUT_MS);

  const blob = await frameWindow.fetch(src, { signal: abort.signal }).then((res) => res.blob());
  if (!blob.type.startsWith("image/") || blob.size > MAX_ICON_BYTES) return null;

  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}
