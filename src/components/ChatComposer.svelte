<script>
  import { tick } from "svelte";

  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Plus from "@lucide/svelte/icons/plus";

  import { chat, MAX_MESSAGE_LENGTH, sendImage, sendMessage } from "../lib/chat.svelte.js";

  const MAX_TEXTAREA_HEIGHT = 140; // ~5 lines, kept in sync with .chatComposerField textarea max-height
  const SEND_COOLDOWN_MS = 1000; // mirrors the server's per-message cooldown

  const IMAGE_ERROR_MESSAGES = {
    too_long: `Messages can't be longer than ${MAX_MESSAGE_LENGTH} characters.`,
    rate_limited: "You're sending messages too fast — slow down a bit.",
  };

  let { placeholder = "Message" } = $props();
  let draft = $state("");
  let imageInput = $state(null);
  let imageError = $state(null);
  let textareaEl = $state(null);
  let onCooldown = $state(false);

  const activeChannel = $derived(chat.channels.find((c) => c.id === chat.activeChannelId));
  const timedOut = $derived(!!chat.timeoutUntil);
  const channelLocked = $derived(!!activeChannel?.locked && !chat.isAdmin);
  // Only these two actually prevent typing — disabling the textarea for the 1s send
  // cooldown too would drop its focus, forcing a re-click on every message sent.
  const inputDisabled = $derived(channelLocked || timedOut);
  const sendDisabled = $derived(inputDisabled || onCooldown);

  function formatTimeoutUntil(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function startCooldown() {
    onCooldown = true;
    setTimeout(() => (onCooldown = false), SEND_COOLDOWN_MS);
  }

  function resizeTextarea() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function send() {
    if (!draft.trim() || sendDisabled) return;

    sendMessage(draft);
    draft = "";
    startCooldown();
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
        startCooldown();
        tick().then(resizeTextarea);
      })
      .catch((err) => (imageError = IMAGE_ERROR_MESSAGES[err.message] ?? err.message));
  }
</script>

<form id="chatComposer" onsubmit={submit}>
  {#if imageError}<p class="chatError">{imageError}</p>{/if}
  <div class="chatComposerField">
    <button
      type="button"
      class="chatImageBtn"
      aria-label="Send an image"
      disabled={sendDisabled}
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
    <textarea
      bind:value={draft}
      bind:this={textareaEl}
      oninput={resizeTextarea}
      onkeydown={onKeydown}
      placeholder={timedOut
        ? `You're timed out until ${formatTimeoutUntil(chat.timeoutUntil)} and can't send messages`
        : channelLocked
          ? "Only admins can post in this channel"
          : placeholder}
      maxlength={MAX_MESSAGE_LENGTH}
      rows="1"
      disabled={inputDisabled}
    ></textarea>
    {#if draft.length > MAX_MESSAGE_LENGTH * 0.8}
      <span class="chatCharCount" class:chatCharCountLimit={draft.length >= MAX_MESSAGE_LENGTH}>
        {draft.length}/{MAX_MESSAGE_LENGTH}
      </span>
    {/if}
    <button class="chatSendBtn" type="submit" aria-label="Send" disabled={sendDisabled}>
      <ArrowUp />
    </button>
  </div>
</form>
