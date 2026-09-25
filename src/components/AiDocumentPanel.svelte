<script>
  import Check from "@lucide/svelte/icons/check";
  import Copy from "@lucide/svelte/icons/copy";
  import X from "@lucide/svelte/icons/x";

  import AiMarkdown from "./AiMarkdown.svelte";

  let { document, onclose } = $props();

  let copied = $state(false);
  let copiedTimeout;

  function copy() {
    navigator.clipboard.writeText(document.content).then(() => {
      clearTimeout(copiedTimeout);
      copied = true;
      copiedTimeout = setTimeout(() => (copied = false), 1500);
    });
  }
</script>

<div id="aiDocumentPanel">
  <div class="aiDocumentPanelHeader">
    <span class="aiDocumentPanelTitle">{document.title}</span>
    <div class="aiDocumentPanelActions">
      <button class="iconbtn" aria-label="Copy document" onclick={copy}>
        {#if copied}<Check />{:else}<Copy />{/if}
      </button>
      <button class="iconbtn" aria-label="Close document" onclick={onclose}>
        <X />
      </button>
    </div>
  </div>
  <div class="aiDocumentPanelBody">
    <AiMarkdown content={document.content} />
    {#if !document.complete}<span class="aiTypingDot"></span>{/if}
  </div>
</div>
