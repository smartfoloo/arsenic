/** Toggle eruda inside a proxied page, so the frame has its own devtools. */
export function inspect(tab) {
  // Static build: the proxy runs cross-origin inside embed.svg, so
  // tab.el.contentDocument is unreachable — embed.svg has its own
  // toggleInspect that does the same thing from inside that origin.
  if (tab.embedPost) {
    tab.embedPost({ type: "frame", action: "inspect" });
    tab.inspecting = !tab.inspecting;
    return;
  }

  const doc = tab.el?.contentDocument;
  if (!doc) return;

  if (tab.inspecting) {
    doc.getElementById("eruda")?.remove();
  } else {
    const eruda = doc.createElement("script");
    eruda.src = "//cdn.jsdelivr.net/npm/eruda";
    eruda.onload = () => {
      const start = doc.createElement("script");
      start.innerHTML = "eruda.init(); eruda.show();";
      doc.head.append(start);
    };
    doc.head.append(eruda);
  }

  tab.inspecting = !tab.inspecting;
}
