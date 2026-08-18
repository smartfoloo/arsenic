<script>
  let { title, message, confirmLabel = "Confirm", onconfirm, onclose } = $props();

  let error = $state(null);
  let busy = $state(false);

  async function confirm() {
    error = null;
    busy = true;
    try {
      await onconfirm();
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
  <div class="chatModal" onclick={(event) => event.stopPropagation()}>
    <h3>{title}</h3>
    <p class="sub">{message}</p>
    {#if error}<p class="chatError">{error}</p>{/if}
    <div class="chatModalActions">
      <button type="button" class="chatModeToggle" onclick={onclose}>Cancel</button>
      <button class="btn" type="button" disabled={busy} onclick={confirm}>{confirmLabel}</button>
    </div>
  </div>
</div>
