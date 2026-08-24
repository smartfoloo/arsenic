<script module>
  /** Only one menu is open at a time, tracked by the id of its owner. */
  let openId = $state(null);
</script>

<script>
  import Check from "@lucide/svelte/icons/check";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  let { id, options, value, onchange, class: extraClass = "" } = $props();

  let active = $state(0);

  const open = $derived(openId === id);
  const selected = $derived(options.find(([val]) => val === value) ?? options[0]);
  const label = $derived(selected[1]);
  const icon = $derived(selected[3]);

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

<div {id} class="select {extraClass}" class:open>
  <button
    type="button"
    class="select-trigger"
    role="combobox"
    aria-controls="{id}-menu"
    aria-expanded={open}
    onclick={toggle}
    onkeydown={keydown}
  >
    <span class="value-group">
      {#if icon}<span class="fi {icon} option-flag"></span>{/if}
      <span class="value">{label}</span>
    </span>
    <span class="chev"><ChevronDown /></span>
  </button>

  <div class="select-menu" id="{id}-menu" role="listbox" tabindex="-1">
    {#each options as [val, text, description, optionIcon], i (val)}
      <!-- Keyboard interaction lives on the combobox trigger, per the ARIA pattern. -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="select-option"
        class:described={description}
        class:active={i === active}
        role="option"
        tabindex="-1"
        aria-selected={val === value}
        onclick={() => pick(val)}
        onpointermove={() => (active = i)}
      >
        <span class="value-group">
          {#if optionIcon}<span class="fi {optionIcon} option-flag"></span>{/if}
          <span class="text">
            {text}
            {#if description}<small>{description}</small>{/if}
          </span>
        </span>
        <span class="check"><Check /></span>
      </div>
    {/each}
  </div>
</div>
