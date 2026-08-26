<script>
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import Lock from "@lucide/svelte/icons/lock";
  import LogOut from "@lucide/svelte/icons/log-out";
  import Plus from "@lucide/svelte/icons/plus";
  import UserCheck from "@lucide/svelte/icons/user-check";

  import ChatPromptModal from "./ChatPromptModal.svelte";
  import ChatProfileModal from "./ChatProfileModal.svelte";
  import { chat, createChannel, logout, moveChannel, switchChannel, unbanUser } from "../lib/chat.svelte.js";

  let channelModalOpen = $state(false);
  let myProfileOpen = $state(false);
  let bannedError = $state(null);

  function onUnban(username) {
    bannedError = null;
    unbanUser(username).catch((err) => (bannedError = err.message));
  }
</script>

<div id="chatSidebar">
  <div class="chatSidebarHeader">
    <h2>Chat</h2>
  </div>

  <div class="chatSidebarScroll">
    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Channels</h3>
        {#if chat.isAdmin}
          <button
            class="chatIconAdd"
            aria-label="Create channel"
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
              class:active={chat.activeChannelId === channel.id}
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
                  disabled={i === 0}
                  onclick={() => moveChannel(channel.id, "up")}
                >
                  <ChevronUp />
                </button>
                <button
                  class="chatReorderBtn"
                  aria-label="Move down"
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
      type="button"
      class="chatProfileBtn"
      aria-label="Your profile"
      onclick={() => (myProfileOpen = true)}
    >
      {#if chat.avatarUrl}
        <img class="chatAvatarBtn" src={chat.avatarUrl} alt="" />
      {:else}
        <span class="chatAvatarBtn chatAvatarFallback">{chat.authUsername[0]?.toUpperCase()}</span>
      {/if}
      <span class="chatProfileName">
        <span class="chatProfileUsername" style={chat.roles[0] ? `color: var(--${chat.roles[0].color})` : ""}>
          {chat.authUsername}
        </span>
        {#each chat.roles as role (role.name)}
          <span class="chatRoleBadge" style="color: var(--{role.color})">{role.name}</span>
        {/each}
      </span>
    </button>
    <button
      class="chatIconBtn"
      aria-label="Log out"
      onclick={logout}
    >
      <LogOut />
    </button>
  </div>
</div>

{#if myProfileOpen}
  <ChatProfileModal username={chat.authUsername} onclose={() => (myProfileOpen = false)} />
{/if}

{#if channelModalOpen}
  <ChatPromptModal
    title="New channel"
    placeholder="channel-name"
    submitLabel="Create"
    onsubmit={(name) => createChannel(name)}
    onclose={() => (channelModalOpen = false)}
  />
{/if}
