<script>
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import UserX from "@lucide/svelte/icons/user-x";

  import ChatAuthForm from "./ChatAuthForm.svelte";
  import ChatComposer from "./ChatComposer.svelte";
  import ChatSidebar from "./ChatSidebar.svelte";
  import { banUser, chat, checkAuth, clearChannel, deleteChannel, deleteMessage } from "../lib/chat.svelte.js";
  import { activeTab } from "../lib/tabs.svelte.js";

  let listEl = $state(null);
  let actionError = $state(null);

  const activeChannel = $derived(chat.channels.find((c) => c.id === chat.activeChannelId));
  const currentMessages = $derived(
    chat.activeDmUsername
      ? (chat.dmThreads[chat.activeDmUsername] ?? [])
      : (chat.channelMessages[chat.activeChannelId] ?? []),
  );
  const title = $derived(chat.activeDmUsername ? `@${chat.activeDmUsername}` : `#${activeChannel?.name ?? ""}`);

  $effect(() => {
    checkAuth();
  });

  $effect(() => {
    if (currentMessages.length && listEl) listEl.scrollTop = listEl.scrollHeight;
  });

  function formatTime(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  async function runAdminAction(fn) {
    actionError = null;
    try {
      await fn();
    } catch (err) {
      actionError = err.message;
    }
  }
</script>

<section class="page" id="chatPage" class:active={activeTab()?.kind === "chat"}>
  <div class="inner">
    {#if !chat.checkedAuth}
      <div class="chatCentered">
        <p class="sub">Loading…</p>
      </div>
    {:else if chat.disabled}
      <div class="chatCentered">
        <h1>Chat</h1>
        <p class="sub">Chat isn't enabled on this server.</p>
      </div>
    {:else if !chat.authUsername}
      <div class="chatCentered">
        <h1>Chat</h1>
        <p class="sub">A public room for everyone using arsenic. Be nice.</p>
        <ChatAuthForm />
      </div>
    {:else}
      <div id="chatLayout">
        <ChatSidebar />

        <div id="chatMain">
          <div id="chatHeader">
            <div class="chatHeaderTitle">{title}</div>
            {#if chat.isAdmin && activeChannel}
              <div class="chatHeaderActions">
                <button
                  class="chatModeToggle"
                  onclick={() => runAdminAction(() => clearChannel(activeChannel.id))}
                >
                  Clear
                </button>
                <button
                  class="chatModeToggle"
                  onclick={() => runAdminAction(() => deleteChannel(activeChannel.id))}
                >
                  Delete channel
                </button>
              </div>
            {/if}
          </div>

          {#if actionError}<p class="chatError">{actionError}</p>{/if}

          <div id="chatMessages" bind:this={listEl}>
            {#each currentMessages as message (message.id)}
              <div class="chatMessage">
                {#if message.avatarUrl}
                  <img class="chatMessageAvatar" src={message.avatarUrl} alt="" />
                {:else}
                  <span class="chatMessageAvatar chatAvatarFallback">
                    {(message.username ?? message.fromUsername)[0]?.toUpperCase()}
                  </span>
                {/if}
                <div class="chatMessageBody">
                  <div class="chatMessageMeta">
                    <b>{message.username ?? message.fromUsername}</b>
                    <small>{formatTime(message.createdAt)}</small>
                    {#if chat.isAdmin && !chat.activeDmUsername}
                      <button
                        class="chatMessageAction"
                        title="Delete message"
                        onclick={() => runAdminAction(() => deleteMessage(message.id))}
                      >
                        <Trash2 />
                      </button>
                      {#if message.username !== chat.authUsername}
                        <button
                          class="chatMessageAction"
                          title="Ban {message.username}"
                          onclick={() => runAdminAction(() => banUser(message.username))}
                        >
                          <UserX />
                        </button>
                      {/if}
                    {/if}
                  </div>
                  <span>{message.body}</span>
                </div>
              </div>
            {/each}
          </div>

          <ChatComposer placeholder={chat.activeDmUsername ? `Message ${chat.activeDmUsername}` : "Message the channel"} />
        </div>
      </div>
    {/if}
  </div>
</section>
