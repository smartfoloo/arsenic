import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/700.css";
import "flag-icons/css/flag-icons.min.css";
import "./app.css";

import { mount } from "svelte";

import App from "./App.svelte";
import { preloadRuntime, prewarm } from "./lib/backends.js";
import { settings } from "./lib/settings.svelte.js";
import { newTab } from "./lib/tabs.svelte.js";

// Start fetching the proxy runtime immediately, then boot it once the shell
// has settled — the same start-page boot every proxy we compared against
// does, rather than making the user's first navigation pay for it. Deferred
// to idle so it never competes with first paint; UrlBar and Bookmarks also
// call prewarm() on focus/hover, which is a no-op once this has run.
preloadRuntime(settings.backend);
globalThis.requestIdleCallback?.(() => prewarm(settings.backend), { timeout: 2000 }) ??
  setTimeout(() => prewarm(settings.backend), 500);

newTab();

export default mount(App, { target: document.body });
