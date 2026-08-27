<script>
  import { tick } from "svelte";

  import Eraser from "@lucide/svelte/icons/eraser";
  import Flag from "@lucide/svelte/icons/flag";
  import Lock from "@lucide/svelte/icons/lock";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Pin from "@lucide/svelte/icons/pin";
  import PinOff from "@lucide/svelte/icons/pin-off";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import Unlock from "@lucide/svelte/icons/unlock";
  import X from "@lucide/svelte/icons/x";

  import ChatAuthForm from "./ChatAuthForm.svelte";
  import ChatComposer from "./ChatComposer.svelte";
  import ChatConfirmModal from "./ChatConfirmModal.svelte";
  import ChatMemberList from "./ChatMemberList.svelte";
  import ChatProfileModal from "./ChatProfileModal.svelte";
  import ChatPromptModal from "./ChatPromptModal.svelte";
  import ChatSidebar from "./ChatSidebar.svelte";
  import {
    chat,
    checkAuth,
    clearChannel,
    deleteChannel,
    deleteMessage,
    loadOlderMessages,
    pinMessage,
    renameChannel,
    reportMessage,
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
  let profileUsername = $state(null);
  let reportMessageTarget = $state(null);
  let reportedMessageIds = $state(new Set());

  const activeChannel = $derived(chat.channels.find((c) => c.id === chat.activeChannelId));
  const messagesLoaded = $derived(chat.channelMessages[chat.activeChannelId] !== undefined);
  const currentMessages = $derived(chat.channelMessages[chat.activeChannelId] ?? []);
  const loadingMore = $derived(!!chat.channelLoadingMore[chat.activeChannelId]);
  const title = $derived(`#${activeChannel?.name ?? ""}`);
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
    const key = chat.activeChannelId;
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
      const isOwnMessage = last.username === chat.authUsername;
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

    const key = chat.activeChannelId;
    const hasMore = chat.channelHasMore[key];
    if (!key || hasMore === false) return;

    prevScrollHeight = listEl.scrollHeight;
    pendingScrollRestore = true;
    loadOlderMessages(chat.activeChannelId);
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

  function formatHoverTime(ms) {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });
  }

  function formatTimeoutUntil(ms) {
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
        <p class="sub">Welcome to arsenic chat!</p>
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
                  class="chatIconBtn"
                  aria-label="Edit channel"
                  use:tooltip={{ text: "Edit channel", class: "chatTooltip" }}
                  onclick={() => (editChannelModalOpen = true)}
                >
                  <Pencil />
                </button>
                <button
                  class="chatIconBtn"
                  aria-label={activeChannel.locked ? "Unlock channel" : "Lock channel"}
                  use:tooltip={{ text: activeChannel.locked ? "Unlock channel" : "Lock channel", class: "chatTooltip" }}
                  onclick={() => runAdminAction(() => setChannelLocked(activeChannel.id, !activeChannel.locked))}
                >
                  {#if activeChannel.locked}<Unlock />{:else}<Lock />{/if}
                </button>
                <button
                  class="chatIconBtn"
                  aria-label="Clear channel"
                  use:tooltip={{ text: "Clear channel", class: "chatTooltip" }}
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
                  class="chatIconBtn"
                  aria-label="Delete channel"
                  use:tooltip={{ text: "Delete channel", class: "chatTooltip" }}
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

          {#if chat.timeoutNotice}
            <div class="chatWarningBanner">
              <TriangleAlert />
              <span>
                You've been timed out until {formatTimeoutUntil(chat.timeoutNotice.until)}{#if chat.timeoutNotice.message}: {chat.timeoutNotice.message}{/if}.
              </span>
              <button
                type="button"
                class="chatIconBtn"
                aria-label="Dismiss"
                onclick={() => (chat.timeoutNotice = null)}
              >
                <X />
              </button>
            </div>
          {/if}

          <div id="chatMessages" bind:this={listEl} onscroll={onMessagesScroll}>
            {#if !messagesLoaded}
              <div class="chatMessagesLoading"><div class="chatSpinner"></div></div>
            {:else if loadingMore}
              <div class="chatMessagesLoadingMore"><div class="chatSpinner"></div></div>
            {/if}
            {#snippet messageActions(message)}
              {#if chat.isAdmin}
                <button
                  class="chatMessageAction"
                  aria-label={message.pinned ? "Unpin message" : "Pin message"}
                  onclick={() =>
                    runAdminAction(() => (message.pinned ? unpinMessage(message.id) : pinMessage(message.id)))}
                >
                  {#if message.pinned}<PinOff />{:else}<Pin />{/if}
                </button>
                <button
                  class="chatMessageAction"
                  aria-label="Delete message"
                  onclick={() => runAdminAction(() => deleteMessage(message.id))}
                >
                  <Trash2 />
                </button>
              {:else if message.username !== chat.authUsername}
                <button
                  class="chatMessageAction"
                  aria-label="Report message"
                  disabled={reportedMessageIds.has(message.id)}
                  onclick={() => (reportMessageTarget = message)}
                >
                  <Flag />
                </button>
              {/if}
            {/snippet}

            {#each currentMessages as message, i (message.id)}
              {@const sender = message.username}
              {@const prev = currentMessages[i - 1]}
              {@const prevSender = prev?.username ?? null}
              {@const isGroupStart =
                i === 0 || prevSender !== sender || message.createdAt - prev.createdAt > GROUP_GAP_MS}
              <div class="chatMessage" class:chatMessageGrouped={!isGroupStart}>
                {#if isGroupStart}
                  <button
                    type="button"
                    class="chatMessageAvatarBtn"
                    aria-label="{sender}'s profile"
                    onclick={() => (profileUsername = sender)}
                  >
                    {#if message.avatarUrl}
                      <img class="chatMessageAvatar" src={message.avatarUrl} alt="" />
                    {:else}
                      <span class="chatMessageAvatar chatAvatarFallback">
                        {sender[0]?.toUpperCase()}
                      </span>
                    {/if}
                  </button>
                {:else}
                  <span class="chatMessageAvatar chatMessageAvatarSpacer">
                    <small class="chatMessageHoverTime">{formatHoverTime(message.createdAt)}</small>
                  </span>
                {/if}
                <div class="chatMessageBody">
                  {#if isGroupStart}
                    <div class="chatMessageMeta">
                      <button
                        type="button"
                        class="chatMessageNameBtn"
                        style={message.roles[0] ? `color: var(--${message.roles[0].color})` : ""}
                        onclick={() => (profileUsername = sender)}
                      >
                        {sender}
                      </button>
                      {#each message.roles as role (role.name)}
                        <span class="chatRoleBadge" style="color: var(--{role.color})">{role.name}</span>
                      {/each}
                      {#if message.pinned}<span class="chatPinnedBadge">Pinned</span>{/if}
                      <small>{formatTime(message.createdAt)}</small>
                      {@render messageActions(message)}
                    </div>
                  {/if}
                  <span class="chatMessageContentRow">
                    <span class="chatMessageContent">
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
                            >{:else}{part.value}{/if}{/each}</span
                        >
                      {/if}
                    </span>
                    {#if !isGroupStart}
                      <span class="chatMessageInlineActions">{@render messageActions(message)}</span>
                    {/if}
                  </span>
                </div>
              </div>
            {/each}
          </div>

          {#if chat.channelError}<p class="chatError">{chat.channelError}</p>{/if}
          <ChatComposer placeholder="Message the channel" />
        </div>

        <ChatMemberList onOpenProfile={(username) => (profileUsername = username)} />
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

  {#if profileUsername}
    <ChatProfileModal username={profileUsername} onclose={() => (profileUsername = null)} />
  {/if}

  {#if reportMessageTarget}
    <ChatPromptModal
      title="Report message"
      placeholder="Reason"
      submitLabel="Report"
      onsubmit={async (reason) => {
        await reportMessage(reportMessageTarget.username, reportMessageTarget.id, reason);
        reportedMessageIds = new Set(reportedMessageIds).add(reportMessageTarget.id);
      }}
      onclose={() => (reportMessageTarget = null)}
    />
  {/if}
</section>
