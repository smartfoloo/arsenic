<script>
  import Search from "@lucide/svelte/icons/search";

  import Select from "./Select.svelte";
  import { BACKEND_OPTIONS, LOCATION_OPTIONS } from "../lib/backends.js";
  import { settings } from "../lib/settings.svelte.js";
  import { activeTab, activeUrl, open } from "../lib/tabs.svelte.js";
  import { resolve } from "../lib/url.js";

  const GOOD_MS = 100;
  const FAIR_MS = 300;

  let query = $state("");
  /** Milliseconds, null while measuring, or "error". */
  let latency = $state(null);

  const visible = $derived(activeTab()?.kind === "proxy" && !activeUrl());
  const label = $derived(
    latency === null ? "measuring…" : latency === "error" ? "unreachable" : `${latency} ms`,
  );
  const level = $derived.by(() => {
    if (typeof latency !== "number") return latency === "error" ? "poor" : "";

    return latency < GOOD_MS ? "good" : latency < FAIR_MS ? "fair" : "poor";
  });

  // Fresh every time the start page comes back into view, without polling.
  $effect(() => {
    if (visible) measure();
  });

  async function measure() {
    latency = null;
    const started = performance.now();

    try {
      const response = await fetch("/ping", { cache: "no-store" });
      if (!response.ok) throw new Error(response.status);
      latency = Math.round(performance.now() - started);
    } catch {
      latency = "error";
    }
  }

  function keydown(event) {
    if (event.key !== "Enter") return;

    const target = resolve(query, settings.search);
    if (target) open(target);
    query = "";
  }

  const partners = [
    { name: "Re:Vault", logo: "/logos/re-vault.png", url: "https://endiseducation.org/" },
    { name: "Catclass", logo: "/logos/catclass.png", url: "https://catclass.net/" }
  ];
</script>

<section class="page" id="startPage" class:active={visible}>
  <a id="discordPill" href="https://discord.gg/VA2JXq52j4" target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
      <path
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
    Join for more links
  </a>

  <div class="inner">
    <h1>arsenic<span class="dot">.</span><span class="version">v2 beta</span></h1>
    <div id="startBar">
      <Search />
      <input
        id="startSearch"
        spellcheck="false"
        placeholder="Search the web"
        bind:value={query}
        onkeydown={keydown}
      />
    </div>
    <div id="startControls">
      <div id="startControlsRight">
        <Select
          id="setStartBackend"
          options={BACKEND_OPTIONS}
          value={settings.backend}
          onchange={(val) => (settings.backend = val)}
        />
        <Select
          id="setStartLocation"
          options={LOCATION_OPTIONS}
          value={settings.location}
          onchange={(val) => (settings.location = val)}
        />
      </div>
    </div>

    {#if partners.length}
      <div id="partners">
        <span class="partners-label">Partners</span>
        <div class="partners-row">
          {#each partners as partner (partner.name)}
            <a
              class="partner"
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
            >
              {#if partner.logo}
                <img class="logo" src={partner.logo} alt="" />
              {:else}
                <span class="logo {partner.accent}">{partner.initial}</span>
              {/if}
              <span class="partner-name">{partner.name}</span>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div id="latency" title="Round trip to the arsenic server">
    <span class="dot {level}"></span>
    {label}
  </div>
</section>
