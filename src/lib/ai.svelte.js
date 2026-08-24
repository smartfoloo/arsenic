const SESSIONS_KEY = "arsenic:aiSessions";

export const MODEL_OPTIONS = [
  ["flash-lite", "Gemini 3.5 Flash Lite", "Our flagship: fast and capable, best for most things"],
  ["gemma", "Gemma 4 31B", "Balanced and reliable, a bit slower on long replies"],
  ["groq", "Compound", "Very fast, can search the web, less consistent on complex asks"],
];

export const DEFAULT_MODEL = "gemma";

function loadSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (s) => s && typeof s.id === "string" && typeof s.title === "string" && Array.isArray(s.messages),
    );
  } catch {
    return [];
  }
}

export const aiStatus = $state({ enabled: null, groqAvailable: false }); // enabled: null until checkAiEnabled resolves

/** Every session that's had at least one message sent — a tab that never
 * sends one stays a draft and never shows up here (see sendAiMessage). */
export const aiSessions = $state(loadSessions());

$effect.root(() => {
  $effect(() => {
    // Proxied sites share this origin's storage and can fill the quota, and
    // a throw in here would take the render loop with it.
    try {
      const serializable = aiSessions.map(({ id, title, model, messages, createdAt, updatedAt }) => ({
        id,
        title,
        model,
        messages,
        createdAt,
        updatedAt,
      }));
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error("couldn't save AI sessions", error);
    }
  });
});

export async function checkAiEnabled() {
  if (aiStatus.enabled !== null) return;

  try {
    const response = await fetch("/ai/status");
    const data = await response.json();
    aiStatus.enabled = !!data.enabled;
    aiStatus.groqAvailable = !!data.groqAvailable;
  } catch {
    aiStatus.enabled = false;
  }
}

export function sessionById(id) {
  return aiSessions.find((s) => s.id === id) ?? null;
}

function titleFromMessage(text) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 60 ? `${clean.slice(0, 60)}…` : clean;
}

/** Deletes the tab's session (if any) and resets it back to a blank draft. */
export function clearAiSession(tab) {
  if (tab.sessionId) {
    const i = aiSessions.findIndex((s) => s.id === tab.sessionId);
    if (i !== -1) aiSessions.splice(i, 1);
  }
  tab.sessionId = null;
  tab.title = "AI";
}

/**
 * A session doesn't exist until its first message is sent — before that,
 * the tab is just a draft (home screen, not yet in history). Sending the
 * first message creates it, titled from that message, and renames the tab;
 * titles never change again after that (sessions aren't renameable).
 */
export async function sendAiMessage(tab, text, model) {
  const content = text.trim();
  if (!content) return;

  let session = tab.sessionId ? sessionById(tab.sessionId) : null;
  if (!session) {
    session = {
      id: crypto.randomUUID(),
      title: titleFromMessage(content),
      model,
      messages: [],
      streaming: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    aiSessions.push(session);
    // Re-read it back out of the reactive array: the object pushed above is
    // still the plain, un-proxied literal, so mutating it directly (below)
    // wouldn't trigger any reactivity — Svelte only wraps what's actually
    // inside the $state array.
    session = aiSessions[aiSessions.length - 1];
    tab.sessionId = session.id;
    tab.title = session.title;
  }
  if (session.streaming) return;

  session.messages.push({ role: "user", content });
  const assistantIndex = session.messages.push({ role: "assistant", content: "" }) - 1;
  session.streaming = true;
  session.updatedAt = Date.now();

  try {
    const response = await fetch("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: session.model,
        messages: session.messages.slice(0, -1).map(({ role, content }) => ({ role, content })),
      }),
    });
    if (!response.ok) {
      let message = "Couldn't reach the AI.";
      try {
        message = (await response.json()).error ?? message;
      } catch {
        // non-JSON error body — fall through with the generic message
      }
      throw new Error(message);
    }
    if (!response.body) throw new Error("Couldn't reach the AI.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = rawEvent.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;

        let payload;
        try {
          payload = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }

        if (payload.delta) session.messages[assistantIndex].content += payload.delta;
        // Shown as the reply itself, not a separate error UI — the point is
        // that a failure reads exactly like a message would.
        else if (payload.error) session.messages[assistantIndex].content = payload.error;
      }
    }
  } catch (err) {
    session.messages[assistantIndex].content = err.message;
  } finally {
    if (!session.messages[assistantIndex]?.content) session.messages.splice(assistantIndex, 1);
    session.streaming = false;
    session.updatedAt = Date.now();
  }
}
