<script>
  import Camera from "@lucide/svelte/icons/camera";
  import Pencil from "@lucide/svelte/icons/pencil";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import UserCheck from "@lucide/svelte/icons/user-check";
  import UserX from "@lucide/svelte/icons/user-x";

  import { banUser, chat, fetchUserProfile, unbanUser, updateBio, uploadAvatar, warnUser } from "../lib/chat.svelte.js";
  import ChatConfirmModal from "./ChatConfirmModal.svelte";
  import ChatPromptModal from "./ChatPromptModal.svelte";

  const MAX_BIO_LENGTH = 190;

  let { username, onclose } = $props();

  let profile = $state(null);
  let loadError = $state(null);
  let editingBio = $state(false);
  let bioDraft = $state("");
  let bioBusy = $state(false);
  let bioError = $state(null);
  let banConfirmOpen = $state(false);
  let warnModalOpen = $state(false);
  let actionError = $state(null);
  let actionBusy = $state(false);
  let avatarInput = $state(null);
  let avatarError = $state(null);

  const isSelf = $derived(username === chat.authUsername);

  $effect(() => {
    profile = null;
    loadError = null;
    fetchUserProfile(username)
      .then((data) => (profile = data))
      .catch((err) => (loadError = err.message));
  });

  function startEditBio() {
    bioDraft = profile.bio ?? "";
    bioError = null;
    editingBio = true;
  }

  async function saveBio() {
    bioError = null;
    bioBusy = true;
    try {
      const data = await updateBio(bioDraft.trim());
      profile.bio = data.bio;
      editingBio = false;
    } catch (err) {
      bioError = err.message;
    } finally {
      bioBusy = false;
    }
  }

  async function runUnban() {
    actionError = null;
    actionBusy = true;
    try {
      await unbanUser(username);
      profile.banned = false;
    } catch (err) {
      actionError = err.message;
    } finally {
      actionBusy = false;
    }
  }

  function formatJoined(ms) {
    return new Date(ms).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
  }

  async function onAvatarChange(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    avatarError = null;
    try {
      await uploadAvatar(file);
      profile.avatarUrl = chat.avatarUrl;
    } catch (err) {
      avatarError = err.message;
    }
  }
</script>

<svelte:window onkeydown={(event) => event.key === "Escape" && onclose()} />

<div class="chatModalBackdrop" onclick={onclose}>
  <div class="chatModal chatProfileModal" onclick={(event) => event.stopPropagation()}>
    {#if loadError}
      <p class="chatError">{loadError}</p>
    {:else if !profile}
      <div class="chatCentered"><div class="chatSpinner"></div></div>
    {:else}
      <div class="chatProfileHeader">
        {#if isSelf}
          <button type="button" class="chatProfileAvatarWrap" aria-label="Change your avatar" onclick={() => avatarInput.click()}>
            {#if profile.avatarUrl}
              <img class="chatProfileAvatar" src={profile.avatarUrl} alt="" />
            {:else}
              <span class="chatProfileAvatar chatAvatarFallback">{profile.username[0]?.toUpperCase()}</span>
            {/if}
            <span class="chatProfileAvatarOverlay"><Camera /></span>
          </button>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            bind:this={avatarInput}
            onchange={onAvatarChange}
            hidden
          />
        {:else if profile.avatarUrl}
          <img class="chatProfileAvatar" src={profile.avatarUrl} alt="" />
        {:else}
          <span class="chatProfileAvatar chatAvatarFallback">{profile.username[0]?.toUpperCase()}</span>
        {/if}
        <div class="chatProfileNames">
          <h3 style={profile.roles[0] ? `color: var(--${profile.roles[0].color})` : ""}>{profile.username}</h3>
          {#each profile.roles as role (role.name)}
            <span class="chatRoleBadge" style="color: var(--{role.color})">{role.name}</span>
          {/each}
        </div>
      </div>
      {#if avatarError}<p class="chatError">{avatarError}</p>{/if}

      <p class="chatProfileJoined">Member since {formatJoined(profile.joinedAt)}</p>

      <div class="chatProfileSection">
        <div class="chatProfileSectionHeading">
          {#if isSelf && !editingBio}
            <button type="button" class="chatIconBtn" aria-label="Edit bio" onclick={startEditBio}>
              <Pencil />
            </button>
          {/if}
        </div>
        {#if editingBio}
          <textarea class="chatProfileBioInput" bind:value={bioDraft} maxlength={MAX_BIO_LENGTH} rows="3"
          ></textarea>
          {#if bioError}<p class="chatError">{bioError}</p>{/if}
          <div class="chatModalActions">
            <button type="button" class="chatModeToggle" onclick={() => (editingBio = false)}>Cancel</button>
            <button class="btn" type="button" disabled={bioBusy} onclick={saveBio}>Save</button>
          </div>
        {:else}
          <p class="chatProfileBio">
            {profile.bio || (isSelf ? "Add a bio to tell people about yourself." : "No bio yet.")}
          </p>
        {/if}
      </div>

      {#if chat.isAdmin && !isSelf}
        <div class="chatProfileAdminActions">
          {#if actionError}<p class="chatError">{actionError}</p>{/if}
          {#if profile.banned}
            <button class="btn" type="button" disabled={actionBusy} onclick={runUnban}>
              <UserCheck /> Unban
            </button>
          {:else}
            <button class="btn danger" type="button" onclick={() => (banConfirmOpen = true)}>
              <UserX /> Ban
            </button>
          {/if}
          <button class="btn" type="button" onclick={() => (warnModalOpen = true)}>
            <TriangleAlert /> Warn
          </button>
          <p class="chatProfileWarningCount">
            {profile.warningCount === 1 ? "1 warning" : `${profile.warningCount ?? 0} warnings`}
          </p>
        </div>
      {/if}
    {/if}
  </div>
</div>

{#if banConfirmOpen}
  <ChatConfirmModal
    title="Ban user"
    message={`Ban ${username}? They'll be logged out and their messages hidden.`}
    confirmLabel="Ban"
    onconfirm={async () => {
      await banUser(username);
      profile.banned = true;
    }}
    onclose={() => (banConfirmOpen = false)}
  />
{/if}

{#if warnModalOpen}
  <ChatPromptModal
    title="Warn user"
    placeholder="Reason"
    submitLabel="Warn"
    onsubmit={async (reason) => {
      const data = await warnUser(username, reason);
      profile.warningCount = data.count;
    }}
    onclose={() => (warnModalOpen = false)}
  />
{/if}
