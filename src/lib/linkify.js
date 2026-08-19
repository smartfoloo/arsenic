const URL_PATTERN = /((?:https?:\/\/|www\.)\S+)/gi;
const MENTION_PATTERN = /#([a-z0-9-]+)/gi;

export function linkify(text) {
  return text.split(URL_PATTERN).map((value, i) => ({
    type: i % 2 === 1 ? "link" : "text",
    value,
  }));
}

export function linkHref(value) {
  return value.startsWith("www.") ? `https://${value}` : value;
}

// Splits "text" segments further, turning #channel-name into a "channel"
// segment when it matches a real channel — anything else stays literal text.
export function withChannelMentions(segments, channelsByName) {
  const result = [];
  for (const segment of segments) {
    if (segment.type !== "text") {
      result.push(segment);
      continue;
    }

    const parts = segment.value.split(MENTION_PATTERN);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        if (parts[i]) result.push({ type: "text", value: parts[i] });
        continue;
      }

      const channel = channelsByName.get(parts[i].toLowerCase());
      if (channel) result.push({ type: "channel", value: parts[i], id: channel.id });
      else result.push({ type: "text", value: `#${parts[i]}` });
    }
  }
  return result;
}
