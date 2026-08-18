<script>
  import ChatAuthForm from "./ChatAuthForm.svelte";
  import { chat, checkAuth, logout, sendMessage } from "../lib/chat.svelte.js";
  import { ui } from "../lib/tabs.svelte.js";

  let draft = $state("");
  let listEl = $state(null);

  $effect(() => {
    checkAuth();
  });

  $effect(() => {
    if (chat.messages.length && listEl) listEl.scrollTop = listEl.scrollHeight;
  });

  function submit(event) {
    event.preventDefault();
    sendMessage(draft);
    draft = "";
  }

  function formatTime(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
</script>

<section class="page" id="chatPage" class:active={ui.chatOpen}>
  <div class="inner">
    <h1>Chat</h1>
    <p class="sub">A public room for everyone using arsenic. Be nice.</p>

    {#if !chat.checkedAuth}
      <p class="sub">Loading…</p>
    {:else if !chat.authUsername}
      <ChatAuthForm />
    {:else}
      <div id="chatRoom">
        <div id="chatWho">
          Logged in as <b>{chat.authUsername}</b>
          <button class="chatModeToggle" onclick={logout}>Log out</button>
        </div>

        <div id="chatMessages" bind:this={listEl}>
          {#each chat.messages as message (message.id)}
            <div class="chatMessage">
              <b>{message.username}</b>
              <span class="chatMessageBody">{message.body}</span>
              <small>{formatTime(message.createdAt)}</small>
            </div>
          {/each}
        </div>

        <form id="chatComposer" onsubmit={submit}>
          <input type="text" bind:value={draft} placeholder="Message the room" autocomplete="off" />
          <button class="btn" type="submit">Send</button>
        </form>
      </div>
    {/if}
  </div>
</section>
