<script module>
  /** Only one menu is open at a time, tracked by the id of its owner. */
  let openId = $state(null);
</script>

<script>
  import Check from "@lucide/svelte/icons/check";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  let { id, options, value, onchange } = $props();

  let active = $state(0);

  const open = $derived(openId === id);
  const label = $derived((options.find(([val]) => val === value) ?? options[0])[1]);

  function toggle() {
    if (open) return (openId = null);

    active = Math.max(
      0,
      options.findIndex(([val]) => val === value),
    );
    openId = id;
  }

  function pick(val) {
    openId = null;
    onchange(val);
  }

  function move(to) {
    active = (to + options.length) % options.length;
  }

  function keydown(event) {
    const select = () => (open ? pick(options[active][0]) : toggle());
    const keys = {
      Escape: () => (openId = null),
      Enter: select,
      " ": select,
      ArrowDown: () => (open ? move(active + 1) : toggle()),
      ArrowUp: () => (open ? move(active - 1) : toggle()),
      Home: () => open && move(0),
      End: () => open && move(options.length - 1),
    };
    if (!keys[event.key]) return;

    event.preventDefault();
    keys[event.key]();
  }
</script>

<svelte:window
  onpointerdown={(event) => {
    if (open && !event.target.closest(".select")) openId = null;
  }}
/>

<div {id} class="select" class:open>
  <button
    type="button"
    class="select-trigger"
    role="combobox"
    aria-controls="{id}-menu"
    aria-expanded={open}
    onclick={toggle}
    onkeydown={keydown}
  >
    <span class="value">{label}</span>
    <span class="chev"><ChevronDown /></span>
  </button>

  <div class="select-menu" id="{id}-menu" role="listbox" tabindex="-1">
    {#each options as [val, text], i (val)}
      <!-- Keyboard interaction lives on the combobox trigger, per the ARIA pattern. -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="select-option"
        class:active={i === active}
        role="option"
        tabindex="-1"
        aria-selected={val === value}
        onclick={() => pick(val)}
        onpointermove={() => (active = i)}
      >
        <span>{text}</span>
        <span class="check"><Check /></span>
      </div>
    {/each}
  </div>
</div>
