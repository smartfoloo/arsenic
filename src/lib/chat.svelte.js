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
});

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

  const response = await fetch(`/chat/api/${path}`, { method, headers, credentials: "same-origin", body });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "request_failed");
  return data;
}

export async function checkAuth() {
  try {
    const data = await request("me");
    chat.authUsername = data.username;
    chat.isAdmin = !!data.isAdmin;
    chat.avatarUrl = data.avatarUrl ?? null;
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
  disconnect();
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const data = await request("avatar", { method: "POST", formData });
  chat.avatarUrl = data.avatarUrl;
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
  if (!chat.channelMessages[id]) send({ type: "history", channelId: id });
}

export function startDm(username) {
  const target = username.trim();
  if (!target) return;

  chat.dmError = null;
  send({ type: "dmHistory", withUsername: target });
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

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  socket = new WebSocket(`${protocol}://${location.host}/chat/ws`);

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

function handleMessage(data) {
  if (data.type === "history") {
    chat.channelMessages[data.channelId] = data.messages;
  } else if (data.type === "message") {
    (chat.channelMessages[data.channelId] ??= []).push(data);
  } else if (data.type === "dm") {
    (chat.dmThreads[otherParty(data)] ??= []).push(data);
  } else if (data.type === "dmHistory") {
    chat.dmThreads[data.withUsername] = data.messages;
    chat.activeChannelId = null;
    chat.activeDmUsername = data.withUsername;
    chat.dmError = null;
  } else if (data.type === "error") {
    if (data.context === "dm" || data.context === "dmHistory") chat.dmError = "That user doesn't exist.";
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
