<script>
  import Select from "./Select.svelte";
  import { BACKEND_OPTIONS, LOCATION_OPTIONS, TRANSPORT_OPTIONS } from "../lib/backends.js";
  import {
    ACCENTS,
    CLOAK_OPTIONS,
    SEARCH_OPTIONS,
    THEME_OPTIONS,
    WALLPAPER_OPTIONS,
    settings,
  } from "../lib/settings.svelte.js";
  import { activeTab } from "../lib/tabs.svelte.js";

  function launchAboutBlank() {
    const win = window.open("about:blank");
    if (!win) return;

    const frame = win.document.createElement("iframe");
    frame.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:0";
    frame.src = location.href;
    win.document.body.style.margin = "0";
    win.document.body.append(frame);
  }

  function clearAllStorage() {
    const ok = confirm(
      "Clear all local storage? This removes your settings, bookmarks, and AI sessions, plus anything sites you've visited through arsenic have stored here. This can't be undone.",
    );
    if (!ok) return;

    localStorage.clear();
    location.reload();
  }
</script>

<section class="page" id="settingsPage" class:active={activeTab()?.kind === "settings"}>
  <div class="inner">
    <h1>Settings</h1>
    <p class="sub">Stored locally in this browser.</p>

    <div class="group">
      <h2>Proxy</h2>
      <div class="card">
        <div class="row">
          <div class="label">
            <b>Backend<span class="badge" id="backendBadge">default</span></b>
            <small>The engine that loads pages for you.</small>
          </div>
          <Select
            id="setBackend"
            options={BACKEND_OPTIONS}
            value={settings.backend}
            onchange={(val) => (settings.backend = val)}
          />
        </div>
        <div class="row">
          <div class="label">
            <b>Transport</b>
            <small>How those pages reach you. Affects open tabs.</small>
          </div>
          <Select
            id="setTransport"
            options={TRANSPORT_OPTIONS}
            value={settings.transport}
            onchange={(val) => (settings.transport = val)}
          />
        </div>
        <div class="row">
          <div class="label">
            <b>Server location</b>
            <small>Where proxied traffic exits to the internet from.</small>
          </div>
          <Select
            id="setLocation"
            options={LOCATION_OPTIONS}
            value={settings.location}
            onchange={(val) => (settings.location = val)}
          />
        </div>
        <div class="row">
          <div class="label">
            <b>Search engine</b>
            <small>Used when the address bar input isn't a URL.</small>
          </div>
          <Select
            id="setSearch"
            options={SEARCH_OPTIONS}
            value={settings.search}
            onchange={(val) => (settings.search = val)}
          />
        </div>
      </div>
    </div>

    <div class="group">
      <h2>Cloaking</h2>
      <div class="card">
        <div class="row">
          <div class="label">
            <b>Tab cloak</b>
            <small>Disguises the page title and favicon.</small>
          </div>
          <Select
            id="setCloak"
            options={CLOAK_OPTIONS}
            value={settings.cloak}
            onchange={(val) => (settings.cloak = val)}
          />
        </div>
        <div class="row">
          <div class="label">
            <b>about:blank</b>
            <small>Reopen arsenic inside a blank window.</small>
          </div>
          <button class="btn" id="aboutBlank" onclick={launchAboutBlank}>Launch</button>
        </div>
      </div>
    </div>

    <div class="group">
      <h2>Appearance</h2>
      <div class="card">
        <div class="row">
          <div class="label">
            <b>Theme</b>
            <small>Catppuccin flavors.</small>
          </div>
          <Select
            id="setTheme"
            options={THEME_OPTIONS}
            value={settings.theme}
            onchange={(val) => (settings.theme = val)}
          />
        </div>
        <div class="row">
          <div class="label">
            <b>Accent</b>
            <small>Highlights, focus rings, active states.</small>
          </div>
          <div class="swatches" id="accents">
            {#each ACCENTS as accent (accent)}
              <button
                class="swatch accent-{accent}"
                class:on={accent === settings.accent}
                title={accent}
                onclick={() => (settings.accent = accent)}
              ></button>
            {/each}
          </div>
        </div>
        <div class="row">
          <div class="label">
            <b>Wallpaper</b>
            <small>Shown behind the start page.</small>
          </div>
          <Select
            id="setWallpaper"
            options={WALLPAPER_OPTIONS}
            value={settings.wallpaper}
            onchange={(val) => (settings.wallpaper = val)}
          />
        </div>
      </div>
    </div>

    <div class="group">
      <h2>Data</h2>
      <div class="card">
        <div class="row">
          <div class="label">
            <b>Clear local storage</b>
            <small>Erases everything saved in this browser, including AI sessions.</small>
          </div>
          <button class="btn danger" onclick={clearAllStorage}>Clear</button>
        </div>
      </div>
    </div>

    <div class="group">
      <h2>About</h2>
      <div class="card">
        <div class="row">
          <img class="creditAvatar" src="/logos/smartfoloo.png" alt="" />
          <div class="label">
            <b>smartfoloo</b>
            <small>Owner</small>
          </div>
        </div>
      </div>
    </div>

    <div class="group">
      <h2>Legal</h2>
      <div class="card">
        <div class="row">
          <div class="label">
            <b>Terms of Service</b>
          </div>
          <a class="btn" href="/legal/terms.html" target="_blank" rel="noopener">View</a>
        </div>
        <div class="row">
          <div class="label">
            <b>Privacy Policy</b>
          </div>
          <a class="btn" href="/legal/privacy.html" target="_blank" rel="noopener">View</a>
        </div>
      </div>
    </div>
  </div>
</section>
