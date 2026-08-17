/** Toggle eruda inside a proxied page, so the frame has its own devtools. */
export function inspect(tab) {
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
