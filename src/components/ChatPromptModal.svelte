<script>
  let {
    title,
    placeholder = "",
    submitLabel = "Create",
    initialValue = "",
    numberPlaceholder = null,
    onsubmit,
    onclose,
  } = $props();

  let value = $state(initialValue);
  let numberValue = $state("");
  let error = $state(null);
  let busy = $state(false);

  async function submit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    if (numberPlaceholder && !(Number(numberValue) > 0)) return;

    error = null;
    busy = true;
    try {
      if (numberPlaceholder) await onsubmit(value.trim(), Number(numberValue));
      else await onsubmit(value.trim());
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
    {#if numberPlaceholder}
      <input
        type="number"
        min="0.1"
        step="0.1"
        placeholder={numberPlaceholder}
        bind:value={numberValue}
        autocomplete="off"
      />
    {/if}
    <input type="text" bind:value {placeholder} autocomplete="off" autofocus={!numberPlaceholder} />
    {#if error}<p class="chatError">{error}</p>{/if}
    <div class="chatModalActions">
      <button type="button" class="chatModeToggle" onclick={onclose}>Cancel</button>
      <button class="btn" type="submit" disabled={busy}>{submitLabel}</button>
    </div>
  </form>
</div>
