export const chat = $state({
  authUsername: null,
  messages: [],
  connected: false,
  checkedAuth: false,
});

let socket = null;

async function api(path, body) {
  const response = await fetch(`/chat/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "request_failed");
  return data;
}

export async function checkAuth() {
  try {
    const response = await fetch("/chat/api/me", { credentials: "same-origin" });
    const data = await response.json();
    chat.authUsername = data.username;
  } finally {
    chat.checkedAuth = true;
  }
  if (chat.authUsername) connect();
}

export async function signup(username, password, agreedToLegal) {
  const data = await api("signup", { username, password, agreedToLegal });
  chat.authUsername = data.username;
  connect();
}

export async function login(username, password) {
  const data = await api("login", { username, password });
  chat.authUsername = data.username;
  connect();
}

export async function logout() {
  await fetch("/chat/api/logout", { method: "POST", credentials: "same-origin" });
  chat.authUsername = null;
  chat.messages = [];
  disconnect();
}

export function connect() {
  if (socket) return;

  const protocol = location.protocol === "https:" ? "wss" : "ws";
  socket = new WebSocket(`${protocol}://${location.host}/chat/ws`);

  socket.onopen = () => (chat.connected = true);
  socket.onclose = () => {
    chat.connected = false;
    socket = null;
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "history") chat.messages = data.messages;
    else if (data.type === "message") chat.messages.push(data);
  };
}

export function disconnect() {
  socket?.close();
  socket = null;
  chat.connected = false;
}

export function sendMessage(body) {
  if (!body.trim() || socket?.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "message", body }));
}
