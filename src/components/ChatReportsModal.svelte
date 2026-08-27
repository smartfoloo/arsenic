<script>
  import { chat, clearReport } from "../lib/chat.svelte.js";

  let { username, onclose } = $props();

  let error = $state(null);
  let clearing = $state(false);

  const reports = $derived(chat.reports.filter((report) => report.targetUsername === username));

  $effect(() => {
    if (chat.isAdmin && reports.length === 0) onclose();
  });

  function formatDate(ms) {
    return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  async function onClearAll() {
    error = null;
    clearing = true;
    try {
      await Promise.all(reports.map((report) => clearReport(report.id)));
    } catch (err) {
      error = err.message;
    } finally {
      clearing = false;
    }
  }
</script>

<svelte:window onkeydown={(event) => event.key === "Escape" && onclose()} />

<div class="chatModalBackdrop" onclick={onclose}>
  <div class="chatModal chatReportsModal" onclick={(event) => event.stopPropagation()}>
    <h3>Reports: {username}</h3>
    {#if error}<p class="chatError">{error}</p>{/if}
    <div class="chatReportEntryList">
      {#each reports as report (report.id)}
        <div class="chatReportEntry">
          {#if report.type === "message"}
            <p class="chatReportQuote">"{report.messageBody}"</p>
          {/if}
          <p class="chatReportMeta">Reported by {report.reporterUsername} · {formatDate(report.createdAt)}</p>
          <p class="chatReportReasonText">{report.reason}</p>
        </div>
      {/each}
    </div>
    <div class="chatModalActions">
      <button type="button" class="chatModeToggle" disabled={clearing} onclick={onClearAll}>Clear</button>
      <button class="btn" type="button" onclick={onclose}>Close</button>
    </div>
  </div>
</div>
