<script>
  import { parseMarkdown } from "../lib/markdown.js";
  import AiMath from "./AiMath.svelte";

  let { content } = $props();
</script>

{#snippet inlineParts(parts)}
  {#each parts as part}
    {#if part.type === "math"}<AiMath value={part.value} />
    {:else if part.type === "bold"}<strong>{@render inlineParts(part.parts)}</strong>
    {:else if part.type === "italic"}<em>{@render inlineParts(part.parts)}</em>
    {:else if part.type === "strike"}<s>{@render inlineParts(part.parts)}</s>
    {:else if part.type === "code"}<code class="aiInlineCode">{part.value}</code>
    {:else if part.type === "link"}<a href={part.href} target="_blank" rel="noopener noreferrer">{part.value}</a>
    {:else}{part.value}{/if}
  {/each}
{/snippet}
{#snippet listBlock(list, nested)}
  {#if list.ordered}
    <ol class="aiList" class:aiSubList={nested} start={list.start}>
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

{#each parseMarkdown(content) as block}
  {#if block.type === "code"}
    <pre class="aiCodeBlock"><code>{block.value}</code></pre>
  {:else if block.type === "math"}
    <AiMath value={block.value} display />
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
