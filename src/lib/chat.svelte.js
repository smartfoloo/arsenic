export const chat = $state({
  authUsername: null,
  isAdmin: false,
  avatarUrl: null,
  connected: false,
  checkedAuth: false,
  disabled: false,
  channels: [],
  activeChannelId: null,
  channelMessages: {},
  activeDmUsername: null,
  dmThreads: {},
  dmPartners: [],
  dmError: null,
  bannedUsers: [],
  channelHasMore: {},
  channelLoadingMore: {},
  dmHasMore: {},
  dmLoadingMore: {},
  channelError: null,
});

const PAGE_SIZE = 50;

// Set only in the static build (see vite.static.config.mjs), which has no
// server of its own to be same-origin with — it authenticates via a bearer
// token instead of a cookie (server/session.js's readAuth). Empty here means
// same-origin cookie auth, unchanged for the main app.
const CHAT_BASE = (import.meta.env.VITE_CHAT_BASE_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "arsenic:chatToken";

function getToken() {
  return CHAT_BASE ? localStorage.getItem(TOKEN_KEY) : null;
}
function setToken(token) {
  if (!CHAT_BASE) return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Server responses carry relative "/chat/..." URLs (avatars, message
// images) — fine same-origin, but a cross-origin static page needs them
// resolved against the chat backend rather than its own origin.
export function resolveChatUrl(path) {
  return path && CHAT_BASE ? `${CHAT_BASE}${path}` : path;
}

let socket = null;

async function request(path, { method = "GET", json, formData } = {}) {
  const headers = {};
  let body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData;
  }
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${CHAT_BASE}/chat/api/${path}`, {
    method,
    headers,
    credentials: CHAT_BASE ? "omit" : "same-origin",
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "request_failed");
  if (data.token !== undefined) setToken(data.token);
  return data;
}

export async function checkAuth() {
  try {
    const data = await request("me");
    chat.authUsername = data.username;
    chat.isAdmin = !!data.isAdmin;
    chat.avatarUrl = resolveChatUrl(data.avatarUrl) ?? null;
  } catch (err) {
    if (err.message === "chat_disabled") chat.disabled = true;
  } finally {
    chat.checkedAuth = true;
  }
  if (chat.authUsername) {
    connect();
    fetchChannels();
    fetchDmPartners();
    if (chat.isAdmin) fetchBannedUsers();
  }
}

export async function signup(username, password, agreedToLegal) {
  await request("signup", { method: "POST", json: { username, password, agreedToLegal } });
  await checkAuth();
}

export async function login(username, password) {
  await request("login", { method: "POST", json: { username, password } });
  await checkAuth();
}

export async function logout() {
  await request("logout", { method: "POST" });
  setToken(null);
  chat.authUsername = null;
  chat.isAdmin = false;
  chat.avatarUrl = null;
  chat.channels = [];
  chat.activeChannelId = null;
  chat.channelMessages = {};
  chat.activeDmUsername = null;
  chat.dmThreads = {};
  chat.dmPartners = [];
  chat.bannedUsers = [];
  chat.channelHasMore = {};
  chat.channelLoadingMore = {};
  chat.dmHasMore = {};
  chat.dmLoadingMore = {};
  disconnect();
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const data = await request("avatar", { method: "POST", formData });
  chat.avatarUrl = resolveChatUrl(data.avatarUrl);
}

export async function fetchChannels() {
  const data = await request("channels");
  chat.channels = data.channels;
  if (!chat.activeChannelId && data.channels.length) switchChannel(data.channels[0].id);
}

export async function fetchDmPartners() {
  const data = await request("dms");
  chat.dmPartners = data.partners;
}

export function switchChannel(id) {
  chat.activeDmUsername = null;
  chat.activeChannelId = id;
  chat.dmError = null;
  chat.channelError = null;
  if (!chat.channelMessages[id]) send({ type: "history", channelId: id });
}

export function startDm(username) {
  const target = username.trim();
  if (!target) return;

  chat.dmError = null;
  send({ type: "dmHistory", withUsername: target });
}

export function loadOlderMessages(channelId) {
  if (chat.channelLoadingMore[channelId] || chat.channelHasMore[channelId] === false) return;

  const oldest = chat.channelMessages[channelId]?.[0];
  if (!oldest) return;

  chat.channelLoadingMore[channelId] = true;
  send({ type: "olderMessages", channelId, beforeId: oldest.id });
}

export function loadOlderDms(username) {
  if (chat.dmLoadingMore[username] || chat.dmHasMore[username] === false) return;

  const oldest = chat.dmThreads[username]?.[0];
  if (!oldest) return;

  chat.dmLoadingMore[username] = true;
  send({ type: "olderDms", withUsername: username, beforeId: oldest.id });
}

export function sendMessage(body) {
  if (!body.trim()) return;

  if (chat.activeDmUsername) send({ type: "dm", toUsername: chat.activeDmUsername, body });
  else if (chat.activeChannelId) send({ type: "message", channelId: chat.activeChannelId, body });
}

export function createChannel(name) {
  return request("admin/channels", { method: "POST", json: { name } });
}

export function deleteChannel(id) {
  return request(`admin/channels/${id}`, { method: "DELETE" });
}

export function clearChannel(id) {
  return request(`admin/channels/${id}/clear`, { method: "POST" });
}

export function deleteMessage(id) {
  return request(`admin/messages/${id}/delete`, { method: "POST" });
}

export function pinMessage(id) {
  return request(`admin/messages/${id}/pin`, { method: "POST" });
}

export function unpinMessage(id) {
  return request(`admin/messages/${id}/unpin`, { method: "POST" });
}

export function renameChannel(id, name) {
  return request(`admin/channels/${id}/rename`, { method: "POST", json: { name } });
}

export function moveChannel(id, direction) {
  return request(`admin/channels/${id}/move`, { method: "POST", json: { direction } });
}

export function setChannelLocked(id, locked) {
  return request(`admin/channels/${id}/lock`, { method: "POST", json: { locked } });
}

export function sendImage(channelId, file, caption) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("body", caption ?? "");
  return request(`admin/channels/${channelId}/image`, { method: "POST", formData });
}

export function banUser(username) {
  return request("admin/ban", { method: "POST", json: { username } });
}

export function unbanUser(username) {
  return request("admin/unban", { method: "POST", json: { username } });
}

export async function fetchBannedUsers() {
  const data = await request("admin/banned");
  chat.bannedUsers = data.users;
}

// The socket takes a moment to open, but callers (e.g. switchChannel on the
// very first load) don't wait for it — queue and flush on open rather than
// silently dropping whatever was sent during that window.
let sendQueue = [];

function send(payload) {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
  else sendQueue.push(payload);
}

export function connect() {
  if (socket) return;

  let wsProtocol, wsHost;
  if (CHAT_BASE) {
    const base = new URL(CHAT_BASE);
    wsProtocol = base.protocol === "https:" ? "wss" : "ws";
    wsHost = base.host;
  } else {
    wsProtocol = location.protocol === "https:" ? "wss" : "ws";
    wsHost = location.host;
  }
  // Browser WebSocket can't carry an Authorization header — the token rides
  // as a query param instead (handleChatUpgrade in server/chat.js).
  const token = getToken();
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  socket = new WebSocket(`${wsProtocol}://${wsHost}/chat/ws${query}`);

  socket.onopen = () => {
    chat.connected = true;
    for (const payload of sendQueue) socket.send(JSON.stringify(payload));
    sendQueue = [];
  };
  socket.onclose = () => {
    chat.connected = false;
    socket = null;
  };
  socket.onmessage = (event) => handleMessage(JSON.parse(event.data));
}

export function disconnect() {
  socket?.close();
  socket = null;
  sendQueue = [];
  chat.connected = false;
}

function otherParty(dm) {
  return dm.fromUsername === chat.authUsername ? dm.toUsername : dm.fromUsername;
}

// Messages arrive over the WebSocket with the same relative "/chat/..."
// URLs the REST responses have (see resolveChatUrl above) — resolve them
// once here rather than at every render site.
function resolveMessage(m) {
  return { ...m, avatarUrl: resolveChatUrl(m.avatarUrl), imageUrl: resolveChatUrl(m.imageUrl) };
}

function handleMessage(data) {
  if (data.type === "history") {
    chat.channelMessages[data.channelId] = data.messages.map(resolveMessage);
    chat.channelHasMore[data.channelId] = data.messages.length === PAGE_SIZE;
  } else if (data.type === "message") {
    (chat.channelMessages[data.channelId] ??= []).push(resolveMessage(data));
  } else if (data.type === "olderMessages") {
    chat.channelMessages[data.channelId] = [
      ...data.messages.map(resolveMessage),
      ...(chat.channelMessages[data.channelId] ?? []),
    ];
    chat.channelHasMore[data.channelId] = data.hasMore;
    chat.channelLoadingMore[data.channelId] = false;
  } else if (data.type === "dm") {
    (chat.dmThreads[otherParty(data)] ??= []).push(resolveMessage(data));
  } else if (data.type === "dmHistory") {
    chat.dmThreads[data.withUsername] = data.messages.map(resolveMessage);
    chat.dmHasMore[data.withUsername] = data.messages.length === PAGE_SIZE;
    chat.activeChannelId = null;
    chat.activeDmUsername = data.withUsername;
    chat.dmError = null;
  } else if (data.type === "olderDms") {
    chat.dmThreads[data.withUsername] = [
      ...data.messages.map(resolveMessage),
      ...(chat.dmThreads[data.withUsername] ?? []),
    ];
    chat.dmHasMore[data.withUsername] = data.hasMore;
    chat.dmLoadingMore[data.withUsername] = false;
  } else if (data.type === "messagePinned" || data.type === "messageUnpinned") {
    const list = chat.channelMessages[data.channelId];
    const message = list?.find((m) => m.id === data.id);
    if (message) message.pinned = data.type === "messagePinned";
  } else if (data.type === "channelRenamed") {
    const channel = chat.channels.find((c) => c.id === data.id);
    if (channel) channel.name = data.name;
  } else if (data.type === "channelLocked") {
    const channel = chat.channels.find((c) => c.id === data.id);
    if (channel) channel.locked = data.locked;
  } else if (data.type === "channelsReordered") {
    chat.channels = data.channels;
  } else if (data.type === "error") {
    if (data.context === "dm" || data.context === "dmHistory") chat.dmError = "That user doesn't exist.";
    else if (data.context === "message" && data.message === "channel_locked") {
      chat.channelError = "This channel is locked — only admins can post.";
    }
  } else if (data.type === "channelCreated") {
    chat.channels.push(data.channel);
  } else if (data.type === "channelDeleted") {
    chat.channels = chat.channels.filter((channel) => channel.id !== data.id);
    delete chat.channelMessages[data.id];
    if (chat.activeChannelId === data.id) switchChannel(chat.channels[0]?.id ?? null);
  } else if (data.type === "channelCleared") {
    if (chat.channelMessages[data.channelId]) chat.channelMessages[data.channelId] = [];
  } else if (data.type === "messageDeleted") {
    const list = chat.channelMessages[data.channelId];
    if (list) chat.channelMessages[data.channelId] = list.filter((message) => message.id !== data.id);
  } else if (data.type === "userBanned") {
    for (const id of Object.keys(chat.channelMessages)) {
      chat.channelMessages[id] = chat.channelMessages[id].filter((m) => m.username !== data.username);
    }
    delete chat.dmThreads[data.username];
    chat.dmPartners = chat.dmPartners.filter((username) => username !== data.username);
    if (chat.activeDmUsername === data.username) chat.activeDmUsername = null;
    if (chat.isAdmin && !chat.bannedUsers.includes(data.username)) {
      chat.bannedUsers = [...chat.bannedUsers, data.username];
    }
  } else if (data.type === "userUnbanned") {
    for (const id of Object.keys(chat.channelMessages)) send({ type: "history", channelId: Number(id) });
    chat.bannedUsers = chat.bannedUsers.filter((username) => username !== data.username);
  }
}
