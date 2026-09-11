<script>
  import { tick } from "svelte";

  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import Eraser from "@lucide/svelte/icons/eraser";

  import AiSidebar from "./AiSidebar.svelte";
  import Select from "./Select.svelte";
  import { aiStatus, aiUi, checkAiEnabled, clearAiSession, defaultModel, MODEL_OPTIONS, sendAiMessage, sessionById } from "../lib/ai.svelte.js";
  import { parseMarkdown } from "../lib/markdown.js";
  import { activeTab } from "../lib/tabs.svelte.js";
  import { tooltip } from "../lib/tooltip.js";

  const active = $derived(activeTab()?.kind === "ai");
  const session = $derived(aiUi.activeSessionId ? sessionById(aiUi.activeSessionId) : null);

  const modelOptions = $derived(
    MODEL_OPTIONS.filter(([value]) => {
      if (value === "luna") return aiStatus.lunaAvailable;
      if (value === "groq") return aiStatus.groqAvailable;
      if (value === "flash-lite" || value === "gemma") return aiStatus.geminiAvailable;
      return true;
    }),
  );

  const MAX_TEXTAREA_HEIGHT = 140; // kept in sync with .chatComposerField textarea max-height

  let listEl = $state(null);
  let draft = $state("");
  // null until the user picks one manually — otherwise tracks defaultModel(),
  // which itself updates once checkAiEnabled learns whether Luna's key is
  // configured (see ai.svelte.js). Only used before a session exists.
  let draftModelOverride = $state(null);
  let textareaEl = $state(null);
  let copiedIndex = $state(null);
  let copiedTimeout;

  const draftModel = $derived(draftModelOverride ?? defaultModel());
  const model = $derived(session ? session.model : draftModel);

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
    else draftModelOverride = val;
  }

  function send() {
    if (!draft.trim() || session?.streaming) return;

    sendAiMessage(draft, model);
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

  function copyMessage(text, i) {
    navigator.clipboard.writeText(text).then(() => {
      clearTimeout(copiedTimeout);
      copiedIndex = i;
      copiedTimeout = setTimeout(() => (copiedIndex = null), 1500);
    });
  }

  // Same convention as ChatPage.svelte's formatTime.
  function formatTime(ms) {
    const date = new Date(ms);
    const now = new Date();
    const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const dayDiff = Math.round(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        new Date(date.getFullYear(), date.getMonth(), date.getDate())) /
        86400000,
    );
    if (dayDiff === 0) return time;
    if (dayDiff === 1) return `Yesterday, ${time}`;
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
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
        <AiSidebar />

        <div class="aiMain">
          <div class="aiHeader">
            <div class="chatHeaderTitle">{session?.title ?? ""}</div>
            {#if session}
              <button
                class="iconbtn"
                onclick={() => clearAiSession()}
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
            {:else}
              {#snippet inlineParts(parts)}
                {#each parts as part}
                  {#if part.type === "bold"}<strong>{part.value}</strong>
                  {:else if part.type === "italic"}<em>{part.value}</em>
                  {:else if part.type === "strike"}<s>{part.value}</s>
                  {:else if part.type === "code"}<code class="aiInlineCode">{part.value}</code>
                  {:else if part.type === "link"}<a href={part.href} target="_blank" rel="noopener noreferrer">{part.value}</a>
                  {:else}{part.value}{/if}
                {/each}
              {/snippet}
              {#snippet listBlock(list, nested)}
                {#if list.ordered}
                  <ol class="aiList" class:aiSubList={nested}>
                    {#each list.items as item}
                      <li>
                        {@render inlineParts(item.parts)}
                        {#if item.sublist}{@render listBlock(item.sublist, true)}{/if}
                      </li>
                    {/each}
                  </ol>
                {:else}
                  <ul class="aiList" class:aiSubList={nested}>
                    {#each list.items as item}
                      <li>
                        {@render inlineParts(item.parts)}
                        {#if item.sublist}{@render listBlock(item.sublist, true)}{/if}
                      </li>
                    {/each}
                  </ul>
                {/if}
              {/snippet}
              {#each session.messages as message, i (i)}
                <div class="aiMessageRow" class:aiMessageRowUser={message.role === "user"}>
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
                          {:else if block.type === "list"}
                            {@render listBlock(block, false)}
                          {:else if block.type === "quote"}
                            <blockquote class="aiQuote">{@render inlineParts(block.parts)}</blockquote>
                          {:else if block.type === "hr"}
                            <hr class="aiHr" />
                          {:else if block.type === "table"}
                            <div class="aiTableWrap">
                              <table class="aiTable">
                                <thead>
                                  <tr>
                                    {#each block.header as cell}<th>{@render inlineParts(cell)}</th>{/each}
                                  </tr>
                                </thead>
                                <tbody>
                                  {#each block.rows as row}
                                    <tr>
                                      {#each row as cell}<td>{@render inlineParts(cell)}</td>{/each}
                                    </tr>
                                  {/each}
                                </tbody>
                              </table>
                            </div>
                          {:else}
                            {@render inlineParts(block.parts)}
                          {/if}
                        {/each}
                      {:else if session.streaming && i === session.messages.length - 1}
                        <span class="aiTypingDot"></span>
                      {/if}
                    </div>
                  </div>
                  {#if message.content}
                    <div class="aiMessageMeta">
                      <button
                        class="iconbtn aiCopyBtn"
                        aria-label="Copy message"
                        onclick={() => copyMessage(message.content, i)}
                      >
                        {#if copiedIndex === i}<Check />{:else}<Copy />{/if}
                      </button>
                      {#if message.sentAt}<span class="aiMessageTime">{formatTime(message.sentAt)}</span>{/if}
                    </div>
                  {/if}
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
                <Select id="aiModel" class="aiModel" options={modelOptions} value={model} onchange={setModel} />
              {/if}
              <button class="chatSendBtn" type="submit" aria-label="Send" disabled={session?.streaming}>
                <ArrowUp />
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</section>
