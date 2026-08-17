<script>
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Search from "@lucide/svelte/icons/search";

  import Select from "./Select.svelte";
  import { BACKEND_OPTIONS } from "../lib/backends.js";
  import { settings } from "../lib/settings.svelte.js";
  import { activeUrl, open, ui } from "../lib/tabs.svelte.js";
  import { resolve } from "../lib/url.js";

  const GOOD_MS = 100;
  const FAIR_MS = 300;

  let query = $state("");
  /** Milliseconds, null while measuring, or "error". */
  let latency = $state(null);

  const visible = $derived(!ui.settingsOpen && !activeUrl());
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
</script>

<section class="page" id="startPage" class:active={visible}>
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
      <Select
        id="setStartBackend"
        options={BACKEND_OPTIONS}
        value={settings.backend}
        onchange={(val) => (settings.backend = val)}
      />
    </div>
    <a id="discordLink" href="https://discord.gg/VA2JXq52j4" target="_blank" rel="noopener noreferrer">
      <MessageCircle />
      Discord
    </a>
  </div>

  <div id="latency" title="Round trip to the arsenic server">
    <span class="dot {level}"></span>
    {label}
  </div>
</section>
