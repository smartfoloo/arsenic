<script>
  import { chat } from "../lib/chat.svelte.js";

  let { onOpenProfile } = $props();

  function shuffled(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const admins = $derived(chat.members.filter((member) => member.isAdmin));
  const members = $derived(shuffled(chat.members.filter((member) => !member.isAdmin)));
</script>

{#snippet memberRow(member)}
  <button type="button" class="chatMemberRow" onclick={() => onOpenProfile(member.username)}>
    {#if member.avatarUrl}
      <img class="chatMemberAvatar" src={member.avatarUrl} alt="" />
    {:else}
      <span class="chatMemberAvatar chatAvatarFallback">{member.username[0]?.toUpperCase()}</span>
    {/if}
    <span class="chatMemberName">{member.username}</span>
  </button>
{/snippet}

<div id="chatMemberList">
  <div class="chatSidebarScroll">
    {#if admins.length}
      <div class="chatSidebarSection">
        <div class="chatSectionHeading">
          <h3>Admins — {admins.length}</h3>
        </div>
        <div class="chatMemberGroup">
          {#each admins as member (member.username)}
            {@render memberRow(member)}
          {/each}
        </div>
      </div>
    {/if}
    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Members — {members.length}</h3>
      </div>
      <div class="chatMemberGroup">
        {#each members as member (member.username)}
          {@render memberRow(member)}
        {/each}
      </div>
    </div>
  </div>
</div>
