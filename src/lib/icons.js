import Book from "@lucide/svelte/icons/book";
import Calendar from "@lucide/svelte/icons/calendar";
import GitBranch from "@lucide/svelte/icons/git-branch";
import Globe from "@lucide/svelte/icons/globe";
import Hash from "@lucide/svelte/icons/hash";
import Mail from "@lucide/svelte/icons/mail";
import MessageCircle from "@lucide/svelte/icons/message-circle";
import Notebook from "@lucide/svelte/icons/notebook";
import Play from "@lucide/svelte/icons/play";
import Search from "@lucide/svelte/icons/search";

/** Stored bookmarks keep the icon name, not the component. */
export const ICONS = {
  book: Book,
  calendar: Calendar,
  "git-branch": GitBranch,
  globe: Globe,
  hash: Hash,
  mail: Mail,
  message: MessageCircle,
  notebook: Notebook,
  play: Play,
  search: Search,
};

const HOST_ICONS = [
  [/^mail\.google/, "mail"],
  [/notion/, "notebook"],
  [/^calendar\.google/, "calendar"],
  [/slack/, "hash"],
  [/youtube/, "play"],
  [/github/, "git-branch"],
  [/reddit/, "message"],
  [/wikipedia/, "book"],
  [/google|duckduckgo|bing|yahoo/, "search"],
];

export function iconForHost(host) {
  return HOST_ICONS.find(([pattern]) => pattern.test(host ?? ""))?.[1] ?? "globe";
}
