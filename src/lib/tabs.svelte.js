import { backends } from "./backends.js";
import { iconForHost } from "./icons.js";
import { MAX_BOOKMARKS, settings } from "./settings.svelte.js";
import { hostOf, titleFor } from "./url.js";

const TAB_COLORS = ["blue", "mauve", "teal", "peach", "green", "pink", "sapphire", "yellow"];
const INTERNAL_TITLES = { settings: "Settings", chat: "Chat" };

export const tabs = $state([]);
export const ui = $state({ activeId: null, collapsed: false });

let seq = 0;

export function backendOf(tab) {
  return backends[tab.backendName];
}

export function tabById(id) {
  return tabs.find((tab) => tab.id === id);
}

export function activeTab() {
  return tabs.find((tab) => tab.id === ui.activeId) ?? null;
}

/** The URL of the active tab, or null on a blank tab or an internal page (settings/chat). */
export function activeUrl() {
  const tab = activeTab();
  return tab?.kind === "proxy" ? (tab.url ?? null) : null;
}

export function newTab(url = null) {
  const id = ++seq;
  const tab = {
    id,
    kind: "proxy",
    url: null,
    title: "New Tab",
    favicon: null,
    color: TAB_COLORS[id % TAB_COLORS.length],
    backendName: settings.backend,
    request: null,
    el: null,
    handle: null,
    inspecting: false,
  };

  tabs.push(tab);
  focus(id);
  if (url) navigate(tabs.at(-1), url);

  return tabs.at(-1);
}

/** Settings and chat are singleton tabs: reuse one already open instead of duplicating it. */
export function openInternal(kind) {
  const existing = tabs.find((tab) => tab.kind === kind);
  if (existing) {
    focus(existing.id);
    return existing;
  }

  const id = ++seq;
  const tab = {
    id,
    kind,
    url: null,
    title: INTERNAL_TITLES[kind],
    favicon: null,
    color: null,
    backendName: null,
    request: null,
    el: null,
    handle: null,
    inspecting: false,
  };

  tabs.push(tab);
  focus(id);
  return tab;
}

export function closeTab(id) {
  const i = tabs.findIndex((tab) => tab.id === id);
  if (i === -1) return;

  tabs.splice(i, 1);
  if (ui.activeId === id) ui.activeId = tabs[Math.min(i, tabs.length - 1)]?.id ?? null;
  if (!tabs.length) newTab();
}

export function focus(id) {
  ui.activeId = id;
}

/**
 * `request` is what the frame watches; `url` is what the sidebar shows. The
 * frame overwrites `url` with wherever the page actually ended up.
 */
export function navigate(tab, url) {
  tab.url = url;
  tab.title = titleFor(url);
  tab.favicon = null;
  tab.inspecting = false;
  tab.request = { url };
}

/** Address bar and start page both land here: reuse the active proxy tab, or open one. */
export function open(url) {
  const tab = activeTab();
  if (tab?.kind === "proxy") navigate(tab, url);
  else newTab(url);
}

export function reload() {
  const tab = activeTab();
  if (!tab?.url) return;

  backendOf(tab).reload(tab.handle);
  tab.inspecting = false;
}

function tabForHost(host) {
  return tabs.find((tab) => tab.url && hostOf(tab.url) === host);
}

export function openBookmark(bookmark) {
  const tab = tabForHost(hostOf(bookmark.url));
  if (tab) focus(tab.id);
  else newTab(bookmark.url);
}

export function isOpen(bookmark) {
  return !!tabForHost(hostOf(bookmark.url));
}

export function isBookmarked(url) {
  const host = hostOf(url);

  return !!host && settings.bookmarks.some((bookmark) => hostOf(bookmark.url) === host);
}

export function toggleBookmark(url) {
  const host = hostOf(url);
  if (!host) return;

  const { bookmarks } = settings;
  const i = bookmarks.findIndex((bookmark) => hostOf(bookmark.url) === host);
  if (i !== -1) {
    bookmarks.splice(i, 1);
  } else if (bookmarks.length < MAX_BOOKMARKS) {
    bookmarks.push({
      url,
      icon: iconForHost(host),
      color: TAB_COLORS[bookmarks.length % TAB_COLORS.length],
      favicon: null,
    });
    cacheBookmarkIcon(url, activeTab()?.favicon);
  }
}

/** Visiting a bookmarked site upgrades its tile from a glyph to the real icon. */
export function cacheBookmarkIcon(pageUrl, favicon) {
  const host = hostOf(pageUrl);
  const bookmark = settings.bookmarks.find((entry) => hostOf(entry.url) === host);
  if (bookmark && favicon) bookmark.favicon = favicon;
}
