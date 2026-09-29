<script>
  let { value, display = false } = $props();

  let el = $state(null);
  let katex = $state(null);

  // KaTeX and its fonts are only fetched once a message actually has math.
  let loading;
  function loadKatex() {
    loading ??= Promise.all([import("katex"), import("katex/dist/katex.min.css")]).then(([m]) => m.default);
    return loading;
  }

  $effect(() => {
    loadKatex().then((k) => (katex = k));
  });

  $effect(() => {
    if (!katex || !el) return;
    try {
      katex.render(value, el, { displayMode: display, throwOnError: false, output: "html" });
    } catch {
      el.textContent = value;
    }
  });
</script>

{#if display}
  <div class="aiMathBlock" bind:this={el}>{value}</div>
{:else}
  <span class="aiMathInline" bind:this={el}>{value}</span>
{/if}
