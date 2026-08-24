<script>
  import { tick } from "svelte";

  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import Eraser from "@lucide/svelte/icons/eraser";

  import Select from "./Select.svelte";
  import {
    aiSessions,
    aiStatus,
    checkAiEnabled,
    clearAiSession,
    DEFAULT_MODEL,
    MODEL_OPTIONS,
    sendAiMessage,
    sessionById,
  } from "../lib/ai.svelte.js";
  import { parseMarkdown } from "../lib/markdown.js";
  import { openAiTab, tabById, ui } from "../lib/tabs.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  // Only the id is passed in — see Frame.svelte for why (a prop bound to the
  // tab object itself breaks once the tabs array shrinks under it).
  let { id } = $props();

  const tab = $derived(tabById(id));
  const active = $derived(tab?.id === ui.activeId);
  const session = $derived(tab?.sessionId ? sessionById(tab.sessionId) : null);

  const modelOptions = $derived(
    aiStatus.groqAvailable ? MODEL_OPTIONS : MODEL_OPTIONS.filter(([value]) => value !== "groq"),
  );

  const MAX_TEXTAREA_HEIGHT = 140; // kept in sync with .chatComposerField textarea max-height
  const HISTORY_PAGE_SIZE = 4;

  let listEl = $state(null);
  let draft = $state("");
  let draftModel = $state(DEFAULT_MODEL); // only used before a session exists
  let textareaEl = $state(null);
  let historyPage = $state(0);

  const model = $derived(session ? session.model : draftModel);

  const historySessions = $derived(
    aiSessions
      .filter((s) => s.id !== tab?.sessionId)
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt),
  );
  const historyPageCount = $derived(Math.max(1, Math.ceil(historySessions.length / HISTORY_PAGE_SIZE)));
  const historyRows = $derived(
    historySessions.slice(historyPage * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE + HISTORY_PAGE_SIZE),
  );

  $effect(() => {
    checkAiEnabled();
  });

  $effect(() => {
    session?.messages.length;
    if (listEl) tick().then(() => listEl && (listEl.scrollTop = listEl.scrollHeight));
  });

  function resizeTextarea() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function setModel(val) {
    if (session) session.model = val;
    else draftModel = val;
  }

  function send() {
    if (!draft.trim() || session?.streaming || !tab) return;

    sendAiMessage(tab, draft, model);
    draft = "";
    tick().then(resizeTextarea);
  }

  function submit(event) {
    event.preventDefault();
    send();
  }

  function onKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }
</script>

<section class="page aiPage" class:active>
  <div class="inner">
    {#if aiStatus.enabled === null}
      <div class="chatCentered chatLoadingScreen">
        <div class="chatSpinner"></div>
      </div>
    {:else if !aiStatus.enabled}
      <div class="chatCentered">
        <h1>AI</h1>
        <p class="sub">AI isn't enabled on this server.</p>
      </div>
    {:else}
      <div class="aiLayout">
        <div class="aiHeader">
          <div class="chatHeaderTitle">{session ? session.title : "AI"}</div>
          {#if session}
            <button
              class="iconbtn"
              onclick={() => clearAiSession(tab)}
              aria-label="Clear conversation"
              use:tooltip={"Clear conversation"}
            >
              <Eraser />
            </button>
          {/if}
        </div>

        <div class="aiMessages" bind:this={listEl}>
          {#if !session}
            <div class="aiEmpty">
              <h1>What's on your mind today?</h1>
            </div>

            {#if historySessions.length}
              <div class="aiHistory">
                <div class="aiHistoryRows">
                  {#each historyRows as row (row.id)}
                    <button class="aiHistoryRow" onclick={() => openAiTab(row.id)}>
                      {row.title}
                    </button>
                  {/each}
                </div>
                {#if historyPageCount > 1}
                  <div class="aiHistoryPager">
                    <button
                      class="iconbtn"
                      disabled={historyPage === 0}
                      onclick={() => historyPage--}
                      aria-label="Newer sessions"
                      use:tooltip={"Newer sessions"}
                    >
                      <ChevronUp />
                    </button>
                    <button
                      class="iconbtn"
                      disabled={historyPage >= historyPageCount - 1}
                      onclick={() => historyPage++}
                      aria-label="Older sessions"
                      use:tooltip={"Older sessions"}
                    >
                      <ChevronDown />
                    </button>
                  </div>
                {/if}
              </div>
            {/if}
          {:else}
            {#snippet inlineParts(parts)}
              {#each parts as part}
                {#if part.type === "bold"}<strong>{part.value}</strong>
                {:else if part.type === "italic"}<em>{part.value}</em>
                {:else if part.type === "code"}<code class="aiInlineCode">{part.value}</code>
                {:else}{part.value}{/if}
              {/each}
            {/snippet}
            {#each session.messages as message, i (i)}
              <div class="aiMessage" class:aiMessageUser={message.role === "user"}>
                <div class="aiMessageBody">
                  {#if message.content}
                    {#each parseMarkdown(message.content) as block}
                      {#if block.type === "code"}
                        <pre class="aiCodeBlock"><code>{block.value}</code></pre>
                      {:else if block.type === "heading"}
                        {#if block.level === 1}
                          <h3 class="aiHeading">{@render inlineParts(block.parts)}</h3>
                        {:else if block.level === 2}
                          <h4 class="aiHeading">{@render inlineParts(block.parts)}</h4>
                        {:else}
                          <h5 class="aiHeading">{@render inlineParts(block.parts)}</h5>
                        {/if}
                      {:else}
                        {@render inlineParts(block.parts)}
                      {/if}
                    {/each}
                  {:else if session.streaming && i === session.messages.length - 1}
                    <span class="aiTypingDot"></span>
                  {/if}
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <form class="aiComposer" onsubmit={submit}>
          <div class="chatComposerField">
            <textarea
              bind:value={draft}
              bind:this={textareaEl}
              oninput={resizeTextarea}
              onkeydown={onKeydown}
              placeholder={session ? "Ask AI" : "What can I help you with?"}
              rows="1"
            ></textarea>
            {#if modelOptions.length > 1}
              <Select id={"aiModel-" + id} class="aiModel" options={modelOptions} value={model} onchange={setModel} />
            {/if}
            <button class="chatSendBtn" type="submit" aria-label="Send" disabled={session?.streaming}>
              <ArrowUp />
            </button>
          </div>
        </form>
      </div>
    {/if}
  </div>
</section>
