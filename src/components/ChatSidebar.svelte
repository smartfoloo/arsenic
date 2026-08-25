<script>
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import Lock from "@lucide/svelte/icons/lock";
  import LogOut from "@lucide/svelte/icons/log-out";
  import Plus from "@lucide/svelte/icons/plus";
  import UserCheck from "@lucide/svelte/icons/user-check";

  import ChatPromptModal from "./ChatPromptModal.svelte";
  import {
    chat,
    createChannel,
    logout,
    moveChannel,
    startDm,
    switchChannel,
    unbanUser,
    uploadAvatar,
  } from "../lib/chat.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  let channelModalOpen = $state(false);
  let dmModalOpen = $state(false);
  let avatarInput = $state(null);
  let avatarError = $state(null);
  let bannedError = $state(null);

  const dmUsernames = $derived([...new Set([...chat.dmPartners, ...Object.keys(chat.dmThreads)])]);

  function onUnban(username) {
    bannedError = null;
    unbanUser(username).catch((err) => (bannedError = err.message));
  }

  function onAvatarChange(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    avatarError = null;
    uploadAvatar(file).catch((err) => (avatarError = err.message));
  }
</script>

<div id="chatSidebar">
  <div class="chatSidebarHeader">
    <h2>Chat</h2>
  </div>
  {#if chat.dmError}<p class="chatError">{chat.dmError}</p>{/if}

  <div class="chatSidebarScroll">
    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Channels</h3>
        {#if chat.isAdmin}
          <button
            class="chatIconAdd"
            aria-label="Create channel"
            use:tooltip={{ text: "Create channel", class: "chatTooltip" }}
            onclick={() => (channelModalOpen = true)}
          >
            <Plus />
          </button>
        {/if}
      </div>
      <div class="chatChannelList">
        {#each chat.channels as channel, i (channel.id)}
          <div class="chatChannelRow">
            <button
              class="chatChannelItem"
              class:active={!chat.activeDmUsername && chat.activeChannelId === channel.id}
              onclick={() => switchChannel(channel.id)}
            >
              # {channel.name}
              {#if channel.locked}<Lock class="chatLockIcon" />{/if}
            </button>
            {#if chat.isAdmin}
              <div class="chatChannelReorder">
                <button
                  class="chatReorderBtn"
                  aria-label="Move up"
                  use:tooltip={{ text: "Move up", class: "chatTooltip" }}
                  disabled={i === 0}
                  onclick={() => moveChannel(channel.id, "up")}
                >
                  <ChevronUp />
                </button>
                <button
                  class="chatReorderBtn"
                  aria-label="Move down"
                  use:tooltip={{ text: "Move down", class: "chatTooltip" }}
                  disabled={i === chat.channels.length - 1}
                  onclick={() => moveChannel(channel.id, "down")}
                >
                  <ChevronDown />
                </button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Direct messages</h3>
        <button
          class="chatIconAdd"
          aria-label="Message someone"
          use:tooltip={{ text: "Message someone", class: "chatTooltip" }}
          onclick={() => (dmModalOpen = true)}
        >
          <Plus />
        </button>
      </div>
      <div class="chatChannelList">
        {#each dmUsernames as username (username)}
          <button
            class="chatChannelItem"
            class:active={chat.activeDmUsername === username}
            onclick={() => startDm(username)}
          >
            {username}
          </button>
        {/each}
      </div>
    </div>

    {#if chat.isAdmin && chat.bannedUsers.length}
      <div class="chatSidebarSection">
        <div class="chatSectionHeading">
          <h3>Banned users</h3>
        </div>
        {#if bannedError}<p class="chatError">{bannedError}</p>{/if}
        <div class="chatChannelList">
          {#each chat.bannedUsers as username (username)}
            <div class="chatBannedItem">
              <span>{username}</span>
              <button
                class="chatIconBtn"
                aria-label="Unban {username}"
                use:tooltip={{ text: `Unban ${username}`, class: "chatTooltip" }}
                onclick={() => onUnban(username)}
              >
                <UserCheck />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div id="chatProfile">
    <button
      class="chatAvatarBtn"
      aria-label="Change your avatar"
      use:tooltip={{ text: "Change your avatar", class: "chatTooltip" }}
      onclick={() => avatarInput.click()}
    >
      {#if chat.avatarUrl}
        <img src={chat.avatarUrl} alt="" />
      {:else}
        <span class="chatAvatarFallback">{chat.authUsername[0]?.toUpperCase()}</span>
      {/if}
    </button>
    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      bind:this={avatarInput}
      onchange={onAvatarChange}
      hidden
    />
    <span class="chatProfileName">
      <span class="chatProfileUsername">{chat.authUsername}</span>
      {#if chat.isAdmin}<span class="chatAdminBadge">Admin</span>{/if}
    </span>
    <button
      class="chatIconBtn"
      aria-label="Log out"
      use:tooltip={{ text: "Log out", class: "chatTooltip" }}
      onclick={logout}
    >
      <LogOut />
    </button>
  </div>
  {#if avatarError}<p class="chatError">{avatarError}</p>{/if}
</div>

{#if channelModalOpen}
  <ChatPromptModal
    title="New channel"
    placeholder="channel-name"
    submitLabel="Create"
    onsubmit={(name) => createChannel(name)}
    onclose={() => (channelModalOpen = false)}
  />
{/if}

{#if dmModalOpen}
  <ChatPromptModal
    title="Message someone"
    placeholder="username"
    submitLabel="Message"
    onsubmit={(username) => startDm(username)}
    onclose={() => (dmModalOpen = false)}
  />
{/if}
