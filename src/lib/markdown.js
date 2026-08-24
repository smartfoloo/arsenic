// Minimal, non-nesting markdown for AI replies: fenced code blocks, plus
// bold/italic/inline code within regular text. Not a CommonMark parser —
// model output doesn't need one, and a flat pass keeps this predictable.

const FENCE_PATTERN = /```(\w*)\n?([\s\S]*?)```/g;
const INLINE_PATTERN = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
const HEADING_PATTERN = /^(#{1,3})\s+(.*)$/;

function parseInline(text) {
  return text
    .split(INLINE_PATTERN)
    .filter((segment) => segment !== "")
    .map((segment) => {
      if (segment.startsWith("**") && segment.endsWith("**")) return { type: "bold", value: segment.slice(2, -2) };
      if (segment.startsWith("__") && segment.endsWith("__")) return { type: "bold", value: segment.slice(2, -2) };
      if (segment.startsWith("`") && segment.endsWith("`")) return { type: "code", value: segment.slice(1, -1) };
      if (segment.startsWith("*") && segment.endsWith("*")) return { type: "italic", value: segment.slice(1, -1) };
      if (segment.startsWith("_") && segment.endsWith("_")) return { type: "italic", value: segment.slice(1, -1) };
      return { type: "text", value: segment };
    });
}

/** `#`/`##`/`###` lines become their own heading blocks; everything else
 * between them is grouped back into text blocks, line breaks intact. */
function parseProse(text) {
  const blocks = [];
  let buffer = [];

  const flush = () => {
    if (!buffer.length) return;
    blocks.push({ type: "text", parts: parseInline(buffer.join("\n")) });
    buffer = [];
  };

  for (const line of text.split("\n")) {
    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      flush();
      blocks.push({ type: "heading", level: heading[1].length, parts: parseInline(heading[2]) });
    } else {
      buffer.push(line);
    }
  }
  flush();

  return blocks;
}

/** Returns a list of blocks: `{ type: "code", lang, value }`, `{ type: "heading", level, parts }`, or `{ type: "text", parts }`. */
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
