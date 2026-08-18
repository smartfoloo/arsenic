<script>
  import Plus from "@lucide/svelte/icons/plus";

  import ChatPromptModal from "./ChatPromptModal.svelte";
  import { chat, createChannel, logout, startDm, switchChannel, uploadAvatar } from "../lib/chat.svelte.js";

  let channelModalOpen = $state(false);
  let dmModalOpen = $state(false);
  let avatarInput = $state(null);
  let avatarError = $state(null);

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
    <button class="chatIconAdd" title="Message someone" onclick={() => (dmModalOpen = true)}>
      <Plus />
    </button>
  </div>
  {#if chat.dmError}<p class="chatError">{chat.dmError}</p>{/if}

  <div class="chatSidebarScroll">
    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Channels</h3>
        {#if chat.isAdmin}
          <button class="chatIconAdd" title="Create channel" onclick={() => (channelModalOpen = true)}>
            <Plus />
          </button>
        {/if}
      </div>
      <div class="chatChannelList">
        {#each chat.channels as channel (channel.id)}
          <button
            class="chatChannelItem"
            class:active={!chat.activeDmUsername && chat.activeChannelId === channel.id}
            onclick={() => switchChannel(channel.id)}
          >
            # {channel.name}
          </button>
        {/each}
      </div>
    </div>

    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Direct messages</h3>
      </div>
      <div class="chatChannelList">
        {#each Object.keys(chat.dmThreads) as username (username)}
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
  </div>

  <div id="chatProfile">
    <button class="chatAvatarBtn" title="Change your avatar" onclick={() => avatarInput.click()}>
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
    <button class="chatModeToggle" onclick={logout}>Log out</button>
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
