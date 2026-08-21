import {
  BACKEND_OPTIONS,
  LOCATION_OPTIONS,
  TRANSPORT_OPTIONS,
  selectLocation,
  selectTransport,
} from "./backends.js";

const KEY = "arsenic:settings";

export const MAX_BOOKMARKS = 4;

export const ACCENTS = ["mauve", "blue", "pink", "teal", "peach", "green"];

export const SEARCH_OPTIONS = [
  ["duckduckgo", "DuckDuckGo"],
  ["google", "Google"],
  ["bing", "Bing"],
  ["yahoo", "Yahoo"],
];

export const CLOAK_OPTIONS = [
  ["default", "Default"],
  ["canvas", "Canvas"],
  ["google-classroom", "Google Classroom"],
  ["google", "Google"],
  ["google-drive", "Google Drive"],
  ["khan-academy", "Khan Academy"],
];

export const THEME_OPTIONS = [
  ["mocha", "Mocha"],
  ["macchiato", "Macchiato"],
  ["frappe", "Frappé"],
];

export const WALLPAPER_OPTIONS = [
  ["none", "None"],
  ["gradient", "Gradient"],
  ["mesh", "Mesh"],
];

const CLOAK_TITLES = {
  canvas: "Dashboard",
  "google-classroom": "Classes",
  google: "Google",
  "google-drive": "My Drive",
  "khan-academy": "Khan Academy",
};

const OPTIONS = {
  backend: BACKEND_OPTIONS,
  transport: TRANSPORT_OPTIONS,
  location: LOCATION_OPTIONS,
  search: SEARCH_OPTIONS,
  cloak: CLOAK_OPTIONS,
  theme: THEME_OPTIONS,
  wallpaper: WALLPAPER_OPTIONS,
};

/**
 * Anything saved under a value we no longer offer is dropped so it falls back
 * to the default. Without this a browser still holding a retired backend would
 * hand tabs a `backendName` that resolves to undefined.
 */
function stored() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
  // A proxied site sharing this origin could have clobbered the key with
  // anything at all, so don't assume an object came back.
  if (!saved || typeof saved !== "object") return {};

  for (const [key, options] of Object.entries(OPTIONS)) {
    if (key in saved && !options.some(([value]) => value === saved[key])) delete saved[key];
  }
  if (!ACCENTS.includes(saved.accent)) delete saved.accent;

  return saved;
}

export const settings = $state({
  backend: "scramjet",
  transport: "epoxy",
  location: "default",
  search: "duckduckgo",
  cloak: "default",
  theme: "mocha",
  accent: "mauve",
  wallpaper: "mesh",
  bookmarks: [],
  ...stored(),
});

$effect.root(() => {
  $effect(() => {
    // Proxied sites write into this same origin's storage and can fill the
    // quota, and a throw in here would take the render loop with it.
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("couldn't save settings", error);
    }
  });

  $effect(() => {
    selectTransport(settings.transport);
  });

  $effect(() => {
    selectLocation(settings.location);
  });

  // Theme, accent, wallpaper and backend are all pure CSS; picking which one
  // applies is the only part that needs JS.
  $effect(() => {
    Object.assign(document.documentElement.dataset, {
      theme: settings.theme,
      accent: settings.accent,
      wallpaper: settings.wallpaper,
      backend: settings.backend,
    });
    document.title = CLOAK_TITLES[settings.cloak] ?? "arsenic";
  });
});
