<script>
  import ArrowUp from "@lucide/svelte/icons/arrow-up";

  import { sendMessage } from "../lib/chat.svelte.js";

  let { placeholder = "Message" } = $props();
  let draft = $state("");

  function submit(event) {
    event.preventDefault();
    if (!draft.trim()) return;

    sendMessage(draft);
    draft = "";
  }
</script>

<form id="chatComposer" onsubmit={submit}>
  <div class="chatComposerField">
    <input type="text" bind:value={draft} {placeholder} autocomplete="off" />
    <button class="chatSendBtn" type="submit" title="Send" aria-label="Send">
      <ArrowUp />
    </button>
  </div>
</form>
