<script>
  import { tick } from "svelte";

  import Eraser from "@lucide/svelte/icons/eraser";
  import Lock from "@lucide/svelte/icons/lock";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Pin from "@lucide/svelte/icons/pin";
  import PinOff from "@lucide/svelte/icons/pin-off";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Unlock from "@lucide/svelte/icons/unlock";
  import UserX from "@lucide/svelte/icons/user-x";

  import ChatAuthForm from "./ChatAuthForm.svelte";
  import ChatComposer from "./ChatComposer.svelte";
  import ChatConfirmModal from "./ChatConfirmModal.svelte";
  import ChatPromptModal from "./ChatPromptModal.svelte";
  import ChatSidebar from "./ChatSidebar.svelte";
  import {
    banUser,
    chat,
    checkAuth,
    clearChannel,
    deleteChannel,
    deleteMessage,
    loadOlderDms,
    loadOlderMessages,
    pinMessage,
    renameChannel,
    setChannelLocked,
    switchChannel,
    unpinMessage,
  } from "../lib/chat.svelte.js";
  import { linkHref, linkify, withChannelMentions } from "../lib/linkify.js";
  import { activeTab } from "../lib/tabs.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  const GROUP_GAP_MS = 5 * 60 * 1000;

  let listEl = $state(null);
  let actionError = $state(null);
  let confirmAction = $state(null);
  let editChannelModalOpen = $state(false);

  const activeChannel = $derived(chat.channels.find((c) => c.id === chat.activeChannelId));
  const messagesLoaded = $derived(
    chat.activeDmUsername
      ? chat.dmThreads[chat.activeDmUsername] !== undefined
      : chat.channelMessages[chat.activeChannelId] !== undefined,
  );
  const currentMessages = $derived(
    chat.activeDmUsername
      ? (chat.dmThreads[chat.activeDmUsername] ?? [])
      : (chat.channelMessages[chat.activeChannelId] ?? []),
  );
  const loadingMore = $derived(
    chat.activeDmUsername
      ? !!chat.dmLoadingMore[chat.activeDmUsername]
      : !!chat.channelLoadingMore[chat.activeChannelId],
  );
  const title = $derived(chat.activeDmUsername ? `@${chat.activeDmUsername}` : `#${activeChannel?.name ?? ""}`);
  const channelsByName = $derived(new Map(chat.channels.map((c) => [c.name.toLowerCase(), c])));

  $effect(() => {
    checkAuth();
  });

  let prevKey = null;
  let prevMessageCount = 0;
  let stickToBottom = true;
  let pendingScrollRestore = false;
  let prevScrollHeight = 0;

  $effect(() => {
    const key = chat.activeDmUsername ?? chat.activeChannelId;
    const count = currentMessages.length;

    if (key !== prevKey) {
      prevKey = key;
      prevMessageCount = count;
      pendingScrollRestore = false;
      stickToBottom = true;
      if (listEl) tick().then(() => listEl && (listEl.scrollTop = listEl.scrollHeight));
      return;
    }

    if (!listEl) {
      prevMessageCount = count;
      return;
    }

    if (pendingScrollRestore) {
      const restoreHeight = prevScrollHeight;
      tick().then(() => {
        if (!listEl) return;
        listEl.scrollTop = listEl.scrollHeight - restoreHeight;
        pendingScrollRestore = false;
      });
    } else if (count > prevMessageCount) {
      const last = currentMessages[count - 1];
      const isOwnMessage = last.username === chat.authUsername || last.fromUsername === chat.authUsername;
      if (stickToBottom || isOwnMessage) {
        tick().then(() => listEl && (listEl.scrollTop = listEl.scrollHeight));
      }
    }
    prevMessageCount = count;
  });

  function onMessagesScroll() {
    if (!listEl) return;

    const distanceFromBottom = listEl.scrollHeight - listEl.scrollTop - listEl.clientHeight;
    stickToBottom = distanceFromBottom < 80;

    if (listEl.scrollTop >= 60 || pendingScrollRestore || loadingMore) return;

    const key = chat.activeDmUsername ?? chat.activeChannelId;
    const hasMore = chat.activeDmUsername ? chat.dmHasMore[key] : chat.channelHasMore[key];
    if (!key || hasMore === false) return;

    prevScrollHeight = listEl.scrollHeight;
    pendingScrollRestore = true;
    if (chat.activeDmUsername) loadOlderDms(chat.activeDmUsername);
    else loadOlderMessages(chat.activeChannelId);
  }

  function formatTime(ms) {
    const date = new Date(ms);
    const now = new Date();
    const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const dayDiff = Math.round(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(date.getFullYear(), date.getMonth(), date.getDate())) /
        86400000,
    );
    if (dayDiff === 0) return time;
    if (dayDiff === 1) return `Yesterday, ${time}`;
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
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
      <div class="chatCentered chatLoadingScreen">
        <div class="chatSpinner"></div>
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
            <div class="chatHeaderTitle">
              {title}
              {#if activeChannel?.locked}<Lock class="chatLockIcon" title="Locked channel" />{/if}
            </div>
            {#if chat.isAdmin && activeChannel}
              <div class="chatHeaderActions">
                <button
                  class="iconbtn"
                  aria-label="Edit channel"
                  use:tooltip={"Edit channel"}
                  onclick={() => (editChannelModalOpen = true)}
                >
                  <Pencil />
                </button>
                <button
                  class="iconbtn"
                  aria-label={activeChannel.locked ? "Unlock channel" : "Lock channel"}
                  use:tooltip={activeChannel.locked ? "Unlock channel" : "Lock channel"}
                  onclick={() => runAdminAction(() => setChannelLocked(activeChannel.id, !activeChannel.locked))}
                >
                  {#if activeChannel.locked}<Unlock />{:else}<Lock />{/if}
                </button>
                <button
                  class="iconbtn"
                  aria-label="Clear channel"
                  use:tooltip={"Clear channel"}
                  onclick={() =>
                    (confirmAction = {
                      title: "Clear channel",
                      message: `Clear all messages in #${activeChannel.name}?`,
                      confirmLabel: "Clear",
                      run: () => clearChannel(activeChannel.id),
                    })}
                >
                  <Eraser />
                </button>
                <button
                  class="iconbtn"
                  aria-label="Delete channel"
                  use:tooltip={"Delete channel"}
                  onclick={() =>
                    (confirmAction = {
                      title: "Delete channel",
                      message: `Delete #${activeChannel.name}? This cannot be undone.`,
                      confirmLabel: "Delete",
                      run: () => deleteChannel(activeChannel.id),
                    })}
                >
                  <Trash2 />
                </button>
              </div>
            {/if}
          </div>

          {#if actionError}<p class="chatError">{actionError}</p>{/if}

          <div id="chatMessages" bind:this={listEl} onscroll={onMessagesScroll}>
            {#if !messagesLoaded}
              <div class="chatMessagesLoading"><div class="chatSpinner"></div></div>
            {:else if loadingMore}
              <div class="chatMessagesLoadingMore"><div class="chatSpinner"></div></div>
            {/if}
            {#snippet messageActions(message)}
              {#if chat.isAdmin && !chat.activeDmUsername}
                <button
                  class="chatMessageAction"
                  aria-label={message.pinned ? "Unpin message" : "Pin message"}
                  use:tooltip={message.pinned ? "Unpin message" : "Pin message"}
                  onclick={() =>
                    runAdminAction(() => (message.pinned ? unpinMessage(message.id) : pinMessage(message.id)))}
                >
                  {#if message.pinned}<PinOff />{:else}<Pin />{/if}
                </button>
                <button
                  class="chatMessageAction"
                  aria-label="Delete message"
                  use:tooltip={"Delete message"}
                  onclick={() => runAdminAction(() => deleteMessage(message.id))}
                >
                  <Trash2 />
                </button>
                {#if message.username !== chat.authUsername}
                  <button
                    class="chatMessageAction"
                    aria-label="Ban {message.username}"
                    use:tooltip={`Ban ${message.username}`}
                    onclick={() =>
                      (confirmAction = {
                        title: "Ban user",
                        message: `Ban ${message.username}? They'll be logged out and their messages hidden.`,
                        confirmLabel: "Ban",
                        run: () => banUser(message.username),
                      })}
                  >
                    <UserX />
                  </button>
                {/if}
              {/if}
            {/snippet}

            {#each currentMessages as message, i (message.id)}
              {@const sender = message.username ?? message.fromUsername}
              {@const prev = currentMessages[i - 1]}
              {@const prevSender = prev ? (prev.username ?? prev.fromUsername) : null}
              {@const isGroupStart =
                i === 0 || prevSender !== sender || message.createdAt - prev.createdAt > GROUP_GAP_MS}
              <div class="chatMessage" class:chatMessageGrouped={!isGroupStart}>
                {#if isGroupStart}
                  {#if message.avatarUrl}
                    <img class="chatMessageAvatar" src={message.avatarUrl} alt="" />
                  {:else}
                    <span class="chatMessageAvatar chatAvatarFallback">
                      {sender[0]?.toUpperCase()}
                    </span>
                  {/if}
                {:else}
                  <span class="chatMessageAvatar chatMessageAvatarSpacer"></span>
                {/if}
                <div class="chatMessageBody">
                  {#if isGroupStart}
                    <div class="chatMessageMeta">
                      <b>{sender}</b>
                      {#if message.isAdmin}<span class="chatAdminBadge">Admin</span>{/if}
                      {#if message.pinned}<span class="chatPinnedBadge">Pinned</span>{/if}
                      <small>{formatTime(message.createdAt)}</small>
                      {@render messageActions(message)}
                    </div>
                  {/if}
                  {#if message.imageUrl}<img class="chatMessageImage" src={message.imageUrl} alt="" />{/if}
                  {#if message.body}
                    <span class="chatMessageText"
                      >{#each withChannelMentions(linkify(message.body), channelsByName) as part}{#if part.type === "link"}<a
                          href={linkHref(part.value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="chatMessageLink">{part.value}</a
                        >{:else if part.type === "channel"}<button
                          type="button"
                          class="chatMessageLink chatChannelMention"
                          onclick={() => switchChannel(part.id)}>#{part.value}</button
                        >{:else}{part.value}{/if}{/each}{#if !isGroupStart}<span
                          class="chatMessageHoverActions"
                          ><small>{formatTime(message.createdAt)}</small>{@render messageActions(
                            message,
                          )}</span
                        >{/if}</span
                    >
                  {:else if !isGroupStart}
                    <span class="chatMessageHoverActions">
                      <small>{formatTime(message.createdAt)}</small>
                      {@render messageActions(message)}
                    </span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

          {#if chat.channelError}<p class="chatError">{chat.channelError}</p>{/if}
          <ChatComposer placeholder={chat.activeDmUsername ? `Message ${chat.activeDmUsername}` : "Message the channel"} />
        </div>
      </div>
    {/if}
  </div>

  {#if confirmAction}
    <ChatConfirmModal
      title={confirmAction.title}
      message={confirmAction.message}
      confirmLabel={confirmAction.confirmLabel}
      onconfirm={() => runAdminAction(confirmAction.run)}
      onclose={() => (confirmAction = null)}
    />
  {/if}

  {#if editChannelModalOpen && activeChannel}
    <ChatPromptModal
      title="Edit channel"
      placeholder="channel-name"
      submitLabel="Save"
      initialValue={activeChannel.name}
      onsubmit={(name) => renameChannel(activeChannel.id, name)}
      onclose={() => (editChannelModalOpen = false)}
    />
  {/if}
</section>
