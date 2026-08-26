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

  // Sectioned by each member's highest-ranked role (server sends roles pre-sorted,
  // rank order taken from ARSENIC_ROLES), highest rank first, roleless members last.
  const roleGroups = $derived(
    chat.roleOrder
      .map((name) => ({ name, members: chat.members.filter((member) => member.roles[0]?.name === name) }))
      .filter((group) => group.members.length),
  );
  const plainMembers = $derived(shuffled(chat.members.filter((member) => !member.roles.length)));
</script>

{#snippet memberRow(member)}
  <button type="button" class="chatMemberRow" onclick={() => onOpenProfile(member.username)}>
    {#if member.avatarUrl}
      <img class="chatMemberAvatar" src={member.avatarUrl} alt="" />
    {:else}
      <span class="chatMemberAvatar chatAvatarFallback">{member.username[0]?.toUpperCase()}</span>
    {/if}
    <span class="chatMemberName" style={member.roles[0] ? `color: var(--${member.roles[0].color})` : ""}>
      {member.username}
    </span>
  </button>
{/snippet}

<div id="chatMemberList">
  <div class="chatSidebarScroll">
    {#each roleGroups as group (group.name)}
      <div class="chatSidebarSection">
        <div class="chatSectionHeading">
          <h3>{group.name} — {group.members.length}</h3>
        </div>
        <div class="chatMemberGroup">
          {#each group.members as member (member.username)}
            {@render memberRow(member)}
          {/each}
        </div>
      </div>
    {/each}
    <div class="chatSidebarSection">
      <div class="chatSectionHeading">
        <h3>Members — {plainMembers.length}</h3>
      </div>
      <div class="chatMemberGroup">
        {#each plainMembers as member (member.username)}
          {@render memberRow(member)}
        {/each}
      </div>
    </div>
  </div>
</div>
