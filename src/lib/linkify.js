const URL_PATTERN = /((?:https?:\/\/|www\.)\S+)/gi;

export function linkify(text) {
  return text.split(URL_PATTERN).map((value, i) => ({
    type: i % 2 === 1 ? "link" : "text",
    value,
  }));
}

export function linkHref(value) {
  return value.startsWith("www.") ? `https://${value}` : value;
}
