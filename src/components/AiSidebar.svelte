<script>
  import Plus from "@lucide/svelte/icons/plus";
  import Trash2 from "@lucide/svelte/icons/trash-2";

  import ChatConfirmModal from "./ChatConfirmModal.svelte";
  import { aiSessions, aiUi, aiUsage, deleteAiSession, switchAiSession } from "../lib/ai.svelte.js";

  const sortedSessions = $derived(aiSessions.slice().sort((a, b) => b.updatedAt - a.updatedAt));
  const usagePct = $derived(aiUsage.limit > 0 ? Math.min(100, (aiUsage.used / aiUsage.limit) * 100) : 0);

  let deleteTarget = $state(null);

  function startNewChat() {
    aiUi.activeSessionId = null;
  }
</script>

<div id="aiSidebar">
  <div class="chatSidebarHeader">
    <h2>AI</h2>
  </div>

  <div class="chatSidebarScroll">
    <div class="chatSidebarSection">
      <div class="chatChannelList">
        <button
          class="chatChannelItem aiNewChatItem"
          class:active={aiUi.activeSessionId === null}
          onclick={startNewChat}
        >
          <Plus class="aiNewChatIcon" />
          New chat
        </button>
        {#each sortedSessions as session (session.id)}
          <div class="chatChannelRow">
            <button
              class="chatChannelItem"
              class:active={aiUi.activeSessionId === session.id}
              onclick={() => switchAiSession(session.id)}
            >
              {session.title}
            </button>
            <button
              class="chatReorderBtn aiSessionDelete"
              aria-label="Delete chat"
              onclick={() => (deleteTarget = session)}
            >
              <Trash2 />
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div id="aiUsageFooter">
    <div class="aiUsageText">
      <span class="aiUsageValue">{aiUsage.used.toLocaleString()}</span>
      <span class="aiUsageLabel">/ {aiUsage.limit.toLocaleString()} tokens today</span>
    </div>
    <div class="aiUsageBar"><div class="aiUsageBarFill" style="width: {usagePct}%"></div></div>
  </div>

  {#if deleteTarget}
    <ChatConfirmModal
      title="Delete chat"
      message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
      confirmLabel="Delete"
      onconfirm={() => deleteAiSession(deleteTarget.id)}
      onclose={() => (deleteTarget = null)}
    />
  {/if}
</div>
