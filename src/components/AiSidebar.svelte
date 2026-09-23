<script>
  import Plus from "@lucide/svelte/icons/plus";

  import { aiSessions, aiUi, aiUsage, switchAiSession } from "../lib/ai.svelte.js";

  const sortedSessions = $derived(aiSessions.slice().sort((a, b) => b.updatedAt - a.updatedAt));
  const usagePct = $derived(aiUsage.limit > 0 ? Math.min(100, (aiUsage.used / aiUsage.limit) * 100) : 0);

  function startNewChat() {
    aiUi.activeSessionId = null;
  }
</script>

<div id="aiSidebar">
  <div class="chatSidebarHeader">
    <h2>AI</h2>
    <button class="chatIconAdd" aria-label="New chat" onclick={startNewChat}>
      <Plus />
    </button>
  </div>

  <div class="chatSidebarScroll">
    <div class="chatSidebarSection">
      <div class="chatChannelList">
        {#each sortedSessions as session (session.id)}
          <button
            class="chatChannelItem"
            class:active={aiUi.activeSessionId === session.id}
            onclick={() => switchAiSession(session.id)}
          >
            {session.title}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div id="aiUsageFooter">
    <div class="aiUsageText">Daily usage {aiUsage.used.toLocaleString()} / {aiUsage.limit.toLocaleString()} tokens</div>
    <div class="aiUsageBar"><div class="aiUsageBarFill" style="width: {usagePct}%"></div></div>
  </div>
</div>
