<script>
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import X from "@lucide/svelte/icons/x";

  const VISIBLE_MS = 5000;
  const FADE_MS = 300;

  let visible = $state(false);
  let closing = $state(false);

  $effect(() => {
    visible = true;
    const hide = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(hide);
  });

  function dismiss() {
    closing = true;
    setTimeout(() => (visible = false), FADE_MS);
  }
</script>

{#if visible}
  <div id="discordToast" class:closing>
    <a
      href="https://discord.gg/VA2JXq52j4"
      target="_blank"
      rel="noopener noreferrer"
      onclick={dismiss}
    >
      Join the discord for links
      <ExternalLink />
    </a>
    <button type="button" aria-label="Dismiss" onclick={dismiss}><X /></button>
  </div>
{/if}
