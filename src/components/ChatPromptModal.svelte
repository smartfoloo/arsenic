<script>
  let { title, placeholder = "", submitLabel = "Create", onsubmit, onclose } = $props();

  let value = $state("");
  let error = $state(null);
  let busy = $state(false);

  async function submit(event) {
    event.preventDefault();
    if (!value.trim()) return;

    error = null;
    busy = true;
    try {
      await onsubmit(value.trim());
      onclose();
    } catch (err) {
      error = err.message;
    } finally {
      busy = false;
    }
  }
</script>

<svelte:window onkeydown={(event) => event.key === "Escape" && onclose()} />

<div class="chatModalBackdrop" onclick={onclose}>
  <form class="chatModal" onclick={(event) => event.stopPropagation()} onsubmit={submit}>
    <h3>{title}</h3>
    <input type="text" bind:value {placeholder} autocomplete="off" autofocus />
    {#if error}<p class="chatError">{error}</p>{/if}
    <div class="chatModalActions">
      <button type="button" class="chatModeToggle" onclick={onclose}>Cancel</button>
      <button class="btn" type="submit" disabled={busy}>{submitLabel}</button>
    </div>
  </form>
</div>
