<script>
  import { tick } from "svelte";

  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import FileText from "@lucide/svelte/icons/file-text";
  import Plus from "@lucide/svelte/icons/plus";
  import X from "@lucide/svelte/icons/x";

  import AiDocumentPanel from "./AiDocumentPanel.svelte";
  import AiMarkdown from "./AiMarkdown.svelte";
  import AiSidebar from "./AiSidebar.svelte";
  import Select from "./Select.svelte";
  import {
    aiStatus,
    aiUi,
    checkAiEnabled,
    defaultModel,
    MAX_IMAGES,
    MODEL_OPTIONS,
    prepareImage,
    sendAiMessage,
    sessionById,
    VISION_MODELS,
  } from "../lib/ai.svelte.js";
  import { splitDocument } from "../lib/markdown.js";
  import { activeTab } from "../lib/tabs.svelte.js";

  const active = $derived(activeTab()?.kind === "ai");
  const session = $derived(aiUi.activeSessionId ? sessionById(aiUi.activeSessionId) : null);

  // The document itself isn't stored separately — it's just parsed back out
  // of whichever assistant message last contained a :::document{} block, so
  // it can never drift out of sync with the (already-persisted) message
  // content. "Latest wins" gives the single-live-document behavior: a newer
  // block simply supersedes whatever an earlier reply produced.
  const activeDocument = $derived.by(() => {
    if (!session) return null;
    for (let i = session.messages.length - 1; i >= 0; i--) {
      const message = session.messages[i];
      if (message.role !== "assistant") continue;
      const { document } = splitDocument(message.content);
      if (document) return document;
    }
    return null;
  });

  let documentPanelOpen = $state(false);
  let panelSessionId = null;
  let panelHadDocument = false;

  // Opens the panel the moment a document first appears — either because a
  // freshly-switched-to session already has one, or because one just started
  // streaming in during this view. Doesn't fight the user: closing it while
  // the same document keeps growing doesn't reopen it.
  $effect(() => {
    const id = session?.id ?? null;
    const has = !!activeDocument;
    if (id !== panelSessionId) {
      panelSessionId = id;
      panelHadDocument = has;
      documentPanelOpen = has;
    } else if (has && !panelHadDocument) {
      panelHadDocument = true;
      documentPanelOpen = true;
    } else {
      panelHadDocument = has;
    }
  });

  const modelOptions = $derived(
    MODEL_OPTIONS.filter(([value]) => {
      if (value === "luna") return aiStatus.lunaAvailable;
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
  const canAttach = $derived(VISION_MODELS.has(model));

  let attachments = $state([]);
  let fileInputEl = $state(null);
  let attachError = $state("");
  let dragging = $state(false);

  // Switching to a model that can't read images drops what's pending.
  $effect(() => {
    if (!canAttach && attachments.length) attachments = [];
  });

  async function addFiles(files) {
    attachError = "";
    const images = [...files].filter((f) => f.type.startsWith("image/"));
    for (const file of images) {
      if (attachments.length >= MAX_IMAGES) {
        attachError = `Up to ${MAX_IMAGES} images per message.`;
        break;
      }
      try {
        attachments.push(await prepareImage(file));
      } catch {
        attachError = "Couldn't read that image.";
      }
    }
  }

  function onPaste(event) {
    if (!canAttach) return;
    const files = [...(event.clipboardData?.files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    event.preventDefault();
    addFiles(files);
  }

  function onDrop(event) {
    dragging = false;
    if (!canAttach || !event.dataTransfer?.files?.length) return;
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

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
    if ((!draft.trim() && !attachments.length) || session?.streaming) return;

    sendAiMessage(draft, model, attachments);
    draft = "";
    attachments = [];
    attachError = "";
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
          <div class="aiBody" class:aiBodyCentered={!session}>
          <div class="aiMessages" bind:this={listEl}>
            {#if !session}
              <div class="aiEmpty">
                <h1>What's on your mind?</h1>
              </div>
            {:else}
              {#each session.messages as message, i (i)}
                {@const split = message.role === "assistant" ? splitDocument(message.content) : { before: message.content, document: null, after: "" }}
                <div class="aiMessageRow" class:aiMessageRowUser={message.role === "user"}>
                  <div class="aiMessage" class:aiMessageUser={message.role === "user"}>
                    <div class="aiMessageBody">
                      {#if message.images?.length}
                        <div class="aiMessageImages">
                          {#each message.images as src}<img {src} alt="Attached" />{/each}
                        </div>
                      {:else if message.imageCount}
                        <div class="aiImageGone">{message.imageCount === 1 ? "Image" : `${message.imageCount} images`} not saved</div>
                      {/if}
                      {#if split.before}<AiMarkdown content={split.before} />{/if}
                      {#if split.document}
                        <button class="aiDocumentCard" onclick={() => (documentPanelOpen = true)}>
                          <FileText class="aiDocumentCardIcon" />
                          <span class="aiDocumentCardText">
                            <span class="aiDocumentCardTitle">{split.document.title}</span>
                            <span class="aiDocumentCardHint">{split.document.complete ? "Click to view" : "Writing…"}</span>
                          </span>
                        </button>
                      {/if}
                      {#if split.after}<AiMarkdown content={split.after} />{/if}
                      {#if !message.content && session.streaming && i === session.messages.length - 1}
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
            <div
              class="aiComposerField"
              class:aiDragging={dragging}
              role="group"
              ondragover={(e) => canAttach && (e.preventDefault(), (dragging = true))}
              ondragleave={() => (dragging = false)}
              ondrop={onDrop}
            >
              {#if attachments.length || attachError}
                <div class="aiAttachments">
                  {#each attachments as src, i}
                    <div class="aiAttachment">
                      <img {src} alt="Attachment" />
                      <button type="button" aria-label="Remove image" onclick={() => attachments.splice(i, 1)}><X /></button>
                    </div>
                  {/each}
                  {#if attachError}<span class="aiAttachError">{attachError}</span>{/if}
                </div>
              {/if}
              {#if canAttach}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  hidden
                  bind:this={fileInputEl}
                  onchange={(e) => {
                    addFiles(e.currentTarget.files);
                    e.currentTarget.value = "";
                  }}
                />
                <button
                  class="chatImageBtn aiAttachBtn"
                  type="button"
                  aria-label="Attach image"
                  disabled={attachments.length >= MAX_IMAGES}
                  onclick={() => fileInputEl.click()}
                >
                  <Plus />
                </button>
              {/if}
              <textarea
                bind:value={draft}
                bind:this={textareaEl}
                oninput={resizeTextarea}
                onkeydown={onKeydown}
                onpaste={onPaste}
                placeholder={session ? "Ask AI" : "How can I help you today?"}
                rows="1"
              ></textarea>
              <div class="aiComposerToolbar">
                <div class="aiComposerToolbarLeft">
                  {#if modelOptions.length > 1}
                    <Select id="aiModel" class="aiModel" options={modelOptions} value={model} onchange={setModel} />
                  {/if}
                </div>
                <button class="chatSendBtn" type="submit" aria-label="Send" disabled={session?.streaming}>
                  <ArrowUp />
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>

        {#if documentPanelOpen && activeDocument}
          <AiDocumentPanel document={activeDocument} onclose={() => (documentPanelOpen = false)} />
        {/if}
      </div>
    {/if}
  </div>
</section>
