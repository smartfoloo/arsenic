<script>
  import { tick } from "svelte";

  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Plus from "@lucide/svelte/icons/plus";

  import { chat, sendImage, sendMessage } from "../lib/chat.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  const MAX_TEXTAREA_HEIGHT = 140; // ~5 lines, kept in sync with .chatComposerField textarea max-height

  let { placeholder = "Message" } = $props();
  let draft = $state("");
  let imageInput = $state(null);
  let imageError = $state(null);
  let textareaEl = $state(null);

  const activeChannel = $derived(chat.channels.find((c) => c.id === chat.activeChannelId));
  const locked = $derived(!chat.activeDmUsername && !!activeChannel?.locked && !chat.isAdmin);

  function resizeTextarea() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function send() {
    if (!draft.trim()) return;

    sendMessage(draft);
    draft = "";
    tick().then(resizeTextarea);
  }

  function submit(event) {
    event.preventDefault();
    send();
  }

  function onKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function onImageChange(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file || !chat.activeChannelId) return;

    imageError = null;
    const caption = draft;
    sendImage(chat.activeChannelId, file, caption)
      .then(() => {
        draft = "";
        tick().then(resizeTextarea);
      })
      .catch((err) => (imageError = err.message));
  }
</script>

<form id="chatComposer" onsubmit={submit}>
  {#if imageError}<p class="chatError">{imageError}</p>{/if}
  <div class="chatComposerField">
    {#if !chat.activeDmUsername}
      <button
        type="button"
        class="chatImageBtn"
        aria-label="Send an image"
        use:tooltip={{ text: "Send an image", class: "chatTooltip" }}
        onclick={() => imageInput.click()}
      >
        <Plus />
      </button>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        bind:this={imageInput}
        onchange={onImageChange}
        hidden
      />
    {/if}
    <textarea
      bind:value={draft}
      bind:this={textareaEl}
      oninput={resizeTextarea}
      onkeydown={onKeydown}
      placeholder={locked ? "Only admins can post in this channel" : placeholder}
      rows="1"
      disabled={locked}
    ></textarea>
    <button class="chatSendBtn" type="submit" aria-label="Send" disabled={locked}>
      <ArrowUp />
    </button>
  </div>
</form>
