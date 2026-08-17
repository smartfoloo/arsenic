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

function stored() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export const settings = $state({
  backend: "scramjet",
  search: "duckduckgo",
  cloak: "default",
  theme: "mocha",
  accent: "mauve",
  wallpaper: "none",
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
