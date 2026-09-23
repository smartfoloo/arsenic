const SESSIONS_KEY = "arsenic:aiSessions";

export const MODEL_OPTIONS = [
  ["luna", "GPT-6 Luna", null, "/logos/openai-light.svg"],
  ["flash-lite", "Gemini 3.5 Flash Lite", null, "/logos/google.svg"],
  ["gemma", "Gemma 4 31B", null, "/logos/google.svg"],
  ["groq", "Compound", null, "/logos/groq-dark.png"],
];

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

export const aiStatus = $state({ enabled: null, groqAvailable: false, geminiAvailable: false, lunaAvailable: false }); // enabled: null until checkAiEnabled resolves

// Luna whenever the server reports an OpenAI key is configured, otherwise
// whichever other provider actually has a key — picker order/labels are
// unaffected, only which one starts pre-selected. The aiStatus.*Available
// flags only resolve once checkAiEnabled's fetch finishes, so this starts
// at "gemma" and updates itself reactively.
export function defaultModel() {
  if (aiStatus.lunaAvailable) return "luna";
  if (aiStatus.geminiAvailable) return "gemma";
  if (aiStatus.groqAvailable) return "groq";
  return "gemma";
}

export const aiUsage = $state({ used: 0, limit: 2500 });

/** Every session that's had at least one message sent — a fresh draft
 * never sends one and never shows up here (see sendAiMessage). */
export const aiSessions = $state(loadSessions());

/** The one AI tab is a singleton (see tabs.svelte.js's openInternal), so
 * which conversation it's showing lives here instead of on the tab, same
 * as chat.svelte.js's activeChannelId. null means the draft/empty state. */
export const aiUi = $state({ activeSessionId: null });

export function switchAiSession(id) {
  aiUi.activeSessionId = id;
}

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
    aiStatus.geminiAvailable = !!data.geminiAvailable;
    aiStatus.lunaAvailable = !!data.lunaAvailable;
    if (typeof data.usageToday === "number") aiUsage.used = data.usageToday;
    if (typeof data.dailyLimit === "number") aiUsage.limit = data.dailyLimit;
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

/** Deletes the active session (if any) and resets back to a blank draft. */
export function clearAiSession() {
  if (aiUi.activeSessionId) {
    const i = aiSessions.findIndex((s) => s.id === aiUi.activeSessionId);
    if (i !== -1) aiSessions.splice(i, 1);
  }
  aiUi.activeSessionId = null;
}

/**
 * A session doesn't exist until its first message is sent — before that,
 * it's just a draft (empty state, not yet in history/the sidebar). Sending
 * the first message creates it and titles it from that message; titles
 * never change again after that (sessions aren't renameable).
 */
export async function sendAiMessage(text, model) {
  const content = text.trim();
  if (!content) return;

  let session = aiUi.activeSessionId ? sessionById(aiUi.activeSessionId) : null;
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
    aiUi.activeSessionId = session.id;
  }
  if (session.streaming) return;

  session.messages.push({ role: "user", content, sentAt: Date.now() });
  // sentAt is filled in once the reply actually finishes (below), not at
  // creation — for an assistant message "time sent" should mean when it was
  // done, not when the placeholder was created.
  const assistantIndex = session.messages.push({ role: "assistant", content: "", sentAt: null }) - 1;
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
        // Present on every tier's terminal event — keeps the sidebar's usage
        // readout live without a separate request.
        if (typeof payload.usageToday === "number") aiUsage.used = payload.usageToday;
        if (typeof payload.dailyLimit === "number") aiUsage.limit = payload.dailyLimit;
      }
    }
  } catch (err) {
    session.messages[assistantIndex].content = err.message;
  } finally {
    if (!session.messages[assistantIndex]?.content) session.messages.splice(assistantIndex, 1);
    else session.messages[assistantIndex].sentAt = Date.now();
    session.streaming = false;
    session.updatedAt = Date.now();
  }
}
