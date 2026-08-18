<script>
  import Plus from "@lucide/svelte/icons/plus";

  import { chat, createChannel, startDm, switchChannel } from "../lib/chat.svelte.js";

  let newChannelName = $state("");
  let newChannelError = $state(null);
  let creatingChannel = $state(false);
  let dmTarget = $state("");

  async function submitNewChannel(event) {
    event.preventDefault();
    if (!newChannelName.trim()) return;

    newChannelError = null;
    creatingChannel = true;
    try {
      await createChannel(newChannelName.trim());
      newChannelName = "";
    } catch (err) {
      newChannelError = err.message === "channel_taken" ? "That channel already exists." : "Invalid name.";
    } finally {
      creatingChannel = false;
    }
  }

  function submitDm(event) {
    event.preventDefault();
    if (!dmTarget.trim()) return;

    startDm(dmTarget);
    dmTarget = "";
  }
</script>

<div id="chatSidebar">
  <div class="chatSidebarSection">
    <h3>Channels</h3>
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
    {#if chat.isAdmin}
      <form class="chatNewChannel" onsubmit={submitNewChannel}>
        <input type="text" placeholder="new-channel" bind:value={newChannelName} />
        <button class="iconbtn" type="submit" title="Create channel" disabled={creatingChannel}>
          <Plus />
        </button>
      </form>
      {#if newChannelError}<p class="chatError">{newChannelError}</p>{/if}
    {/if}
  </div>

  <div class="chatSidebarSection">
    <h3>Direct messages</h3>
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
    <form class="chatNewChannel" onsubmit={submitDm}>
      <input type="text" placeholder="Message a user" bind:value={dmTarget} />
    </form>
    {#if chat.dmError}<p class="chatError">{chat.dmError}</p>{/if}
  </div>
</div>
