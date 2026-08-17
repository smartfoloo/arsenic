<script>
  import Content from "./components/Content.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import { closeTab, newTab, ui } from "./lib/tabs.svelte.js";

  function shortcut(event) {
    if (!(event.metaKey || event.ctrlKey)) return;

    const key = event.key.toLowerCase();
    if (key === "t") newTab();
    else if (key === "w") closeTab(ui.activeId);
    else if (key === "s") ui.collapsed = !ui.collapsed;
    else return;

    event.preventDefault();
  }
</script>

<svelte:window onkeydown={shortcut} />

<div id="app" class:collapsed={ui.collapsed}>
  <Sidebar />
  <Content />
</div>
