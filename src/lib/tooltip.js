const GAP = 8;
const MARGIN = 8;

/**
 * Svelte action for a hover/focus tooltip. Renders into `document.body` as
 * `position: fixed`, not next to the trigger — icon buttons live inside
 * containers with `overflow: hidden` (the sidebar, chat panes), so a
 * tooltip positioned relative to its trigger would get clipped right at
 * that container's edge. Placement (above/below) and horizontal offset are
 * computed from the trigger's actual bounding box against the viewport, so
 * it never overflows a screen corner either.
 */
// `value` is either the tooltip text, or { text, class } to add an extra
// class (e.g. chat's smaller variant) alongside the base "app-tooltip".
export function tooltip(node, value) {
  let el = null;
  let current = normalize(value);

  function normalize(v) {
    return typeof v === "string" ? { text: v, class: null } : { text: v?.text ?? "", class: v?.class ?? null };
  }

  function show() {
    if (!current.text) return;

    el = document.createElement("div");
    el.className = current.class ? `app-tooltip ${current.class}` : "app-tooltip";
    el.textContent = current.text;
    document.body.appendChild(el);
    place();
  }

  function place() {
    if (!el) return;

    const trigger = node.getBoundingClientRect();
    const tip = el.getBoundingClientRect();

    let top = trigger.top - tip.height - GAP;
    if (top < MARGIN) top = trigger.bottom + GAP;

    let left = trigger.left + trigger.width / 2 - tip.width / 2;
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - tip.width - MARGIN));

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  }

  function hide() {
    el?.remove();
    el = null;
  }

  node.addEventListener("mouseenter", show);
  node.addEventListener("mouseleave", hide);
  node.addEventListener("focus", show);
  node.addEventListener("blur", hide);
  node.addEventListener("pointerdown", hide);

  return {
    update(next) {
      current = normalize(next);
      if (el) hide();
    },
    destroy() {
      hide();
      node.removeEventListener("mouseenter", show);
      node.removeEventListener("mouseleave", hide);
      node.removeEventListener("focus", show);
      node.removeEventListener("blur", hide);
      node.removeEventListener("pointerdown", hide);
    },
  };
}
