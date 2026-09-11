// Minimal markdown for AI replies: fenced code blocks, headings, lists (one
// level of nesting — the common "1. Section\n   - detail" shape models
// output), tables, blockquotes, rules, links, plus bold/italic/strike/inline
// code within regular text. Not a CommonMark parser — model output doesn't
// need one, and a flat pass keeps this predictable.

const FENCE_PATTERN = /```(\w*)\n?([\s\S]*?)```/g;
const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|`[^`]+`|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;
const HEADING_PATTERN = /^(#{1,3})\s+(.*)$/;
const HR_PATTERN = /^\s*([-*_])(?:\s*\1){2,}\s*$/;
const UL_PATTERN = /^(\s*)[-*+]\s+(.*)$/;
const OL_PATTERN = /^(\s*)\d+[.)]\s+(.*)$/;
const QUOTE_PATTERN = /^>\s?(.*)$/;
const TABLE_SEPARATOR_PATTERN = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;

function parseInline(text) {
  return text
    .split(INLINE_PATTERN)
    .filter((segment) => segment !== "")
    .map((segment) => {
      if (segment.startsWith("**") && segment.endsWith("**")) return { type: "bold", value: segment.slice(2, -2) };
      if (segment.startsWith("__") && segment.endsWith("__")) return { type: "bold", value: segment.slice(2, -2) };
      if (segment.startsWith("~~") && segment.endsWith("~~")) return { type: "strike", value: segment.slice(2, -2) };
      if (segment.startsWith("`") && segment.endsWith("`")) return { type: "code", value: segment.slice(1, -1) };
      if (segment.startsWith("*") && segment.endsWith("*")) return { type: "italic", value: segment.slice(1, -1) };
      if (segment.startsWith("_") && segment.endsWith("_")) return { type: "italic", value: segment.slice(1, -1) };
      const link = LINK_PATTERN.exec(segment);
      if (link) return { type: "link", value: link[1], href: link[2] };
      return { type: "text", value: segment };
    });
}

function isTableRow(line) {
  return line.includes("|") && line.trim().length > 0;
}

function splitTableRow(line) {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|")) row = row.slice(0, -1);
  return row.split("|").map((cell) => cell.trim());
}

/** `null` for a non-list line, otherwise `{ ordered, indent, content }` —
 * indent is just the leading-whitespace length, compared relatively rather
 * than against fixed tab stops, so it tolerates whatever the model used. */
function matchListMarker(line) {
  const ol = OL_PATTERN.exec(line);
  if (ol) return { ordered: true, indent: ol[1].length, content: ol[2] };
  const ul = UL_PATTERN.exec(line);
  if (ul) return { ordered: false, indent: ul[1].length, content: ul[2] };
  return null;
}

/** Index of the next non-blank line at or after `i`. */
function skipBlank(lines, i) {
  let j = i;
  while (j < lines.length && lines[j].trim() === "") j++;
  return j;
}

/** Line-based block parser: `#`/`##`/`###` headings, `-`/`*`/`1.` lists,
 * `> ` quotes, `---` rules, and `| a | b |` tables each become their own
 * block; everything else between them is grouped back into text blocks,
 * line breaks intact. */
function parseProse(text) {
  const lines = text.split("\n");
  const blocks = [];
  let buffer = [];

  const flushText = () => {
    if (!buffer.length) return;
    const joined = buffer.join("\n");
    if (joined.trim()) blocks.push({ type: "text", parts: parseInline(joined) });
    buffer = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      flushText();
      blocks.push({ type: "heading", level: heading[1].length, parts: parseInline(heading[2]) });
      i++;
      continue;
    }

    if (HR_PATTERN.test(line)) {
      flushText();
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (QUOTE_PATTERN.test(line)) {
      flushText();
      const quoteLines = [];
      while (i < lines.length && QUOTE_PATTERN.test(lines[i])) {
        quoteLines.push(QUOTE_PATTERN.exec(lines[i])[1]);
        i++;
      }
      blocks.push({ type: "quote", parts: parseInline(quoteLines.join("\n")) });
      continue;
    }

    if (isTableRow(line) && i + 1 < lines.length && TABLE_SEPARATOR_PATTERN.test(lines[i + 1])) {
      flushText();
      const header = splitTableRow(line).map(parseInline);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i]) && !TABLE_SEPARATOR_PATTERN.test(lines[i])) {
        rows.push(splitTableRow(lines[i]).map(parseInline));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    const marker = matchListMarker(line);
    if (marker) {
      flushText();
      const { ordered, indent: baseIndent } = marker;
      const items = [];

      while (i < lines.length) {
        if (lines[i].trim() === "") {
          const next = skipBlank(lines, i);
          // A blank line only continues the list if another list item
          // follows — otherwise it's where the list actually ends.
          if (next < lines.length && matchListMarker(lines[next])) {
            i = next;
            continue;
          }
          break;
        }

        const here = matchListMarker(lines[i]);
        if (!here || here.indent < baseIndent) break;

        if (here.indent > baseIndent) {
          // More-indented lines belong to the previous item as a single
          // (possibly mixed-marker) sub-list — one level deep is enough
          // for the "1. Section\n   - detail" shape models actually send.
          const subOrdered = here.ordered;
          const subItems = [];
          while (i < lines.length) {
            if (lines[i].trim() === "") {
              const next = skipBlank(lines, i);
              const nextMarker = next < lines.length ? matchListMarker(lines[next]) : null;
              if (nextMarker && nextMarker.indent > baseIndent) {
                i = next;
                continue;
              }
              break;
            }
            const sub = matchListMarker(lines[i]);
            if (!sub || sub.indent <= baseIndent) break;
            subItems.push({ parts: parseInline(sub.content), sublist: null });
            i++;
          }
          if (items.length) items[items.length - 1].sublist = { ordered: subOrdered, items: subItems };
          continue;
        }

        if (here.ordered !== ordered) break;
        items.push({ parts: parseInline(here.content), sublist: null });
        i++;
      }

      blocks.push({ type: "list", ordered, items });
      continue;
    }

    buffer.push(line);
    i++;
  }
  flushText();

  return blocks;
}

/** Returns a list of blocks: `{ type: "code", lang, value }`,
 * `{ type: "heading", level, parts }`,
 * `{ type: "list", ordered, items }` — each item is
 * `{ parts, sublist: { ordered, items } | null }`, one level deep —
 * `{ type: "quote", parts }`, `{ type: "table", header, rows }` (cells are
 * inline-parts arrays), `{ type: "hr" }`, or `{ type: "text", parts }`. */
export function parseMarkdown(text) {
  const blocks = [];
  let lastIndex = 0;
  let match;

  FENCE_PATTERN.lastIndex = 0;
  while ((match = FENCE_PATTERN.exec(text))) {
    if (match.index > lastIndex) blocks.push(...parseProse(text.slice(lastIndex, match.index)));
    blocks.push({ type: "code", lang: match[1], value: match[2].replace(/\n$/, "") });
    lastIndex = FENCE_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) blocks.push(...parseProse(text.slice(lastIndex)));

  return blocks;
}
