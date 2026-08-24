// Off by default, same opt-in shape as chat: an open-source clone only talks
// to a paid LLM API when its operator deliberately turns it on and supplies
// a Google AI Studio key. Groq is an optional secondary — the feature still
// works with only the primary key set, it just has no fallback.
export const aiEnabled = process.env.ARSENIC_AI_ENABLED === "true" && !!process.env.GOOGLE_AI_API_KEY;

const GEMINI_FLASH_LITE_MODEL = "gemini-3.5-flash-lite";
const GEMINI_FALLBACK_MODEL = "gemma-4-31b-it";
const GROQ_MODEL = "groq/compound";
const SYSTEM_PROMPT =
  "You are a helpful, concise AI assistant embedded in arsenic, a web browser. Keep answers friendly and to the point.";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

// No login is required to use this (see AGENTS.md), so the only thing
// standing between an open proxy and a runaway API bill is this. Sized for
// a real conversation, not a scripted flood.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const requestLog = new Map();

function allowRequest(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return true;
}

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, timestamps] of requestLog) {
      const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (fresh.length) requestLog.set(ip, fresh);
      else requestLog.delete(ip);
    }
  },
  RATE_LIMIT_WINDOW_MS,
).unref();

function sanitizeMessages(input) {
  if (!Array.isArray(input) || !input.length) return null;

  const out = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return null;
    if (typeof m.content !== "string") return null;

    const content = m.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return null;

    out.push({ role: m.role, content });
  }
  if (out[out.length - 1].role !== "user") return null;

  return out;
}

/**
 * Decodes an upstream SSE body into individual `data:` payload strings.
 * Google's stream separates events with CRLF pairs (`\r\n\r\n`); Groq's
 * OpenAI-compatible stream uses bare `\n\n` — normalizing line endings
 * first means one parser handles both instead of silently matching neither.
 */
async function* sseEvents(body) {
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true }).replace(/\r\n/g, "\n");

    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLines = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());
      if (dataLines.length) yield dataLines.join("\n");
    }
  }
}

/** Thrown by both provider streamers. `rateLimited` drives the explicit
 * "switch models" message in handleAiChat instead of the raw upstream text. */
class StreamError extends Error {
  constructor(message, rateLimited) {
    super(message);
    this.rateLimited = rateLimited;
  }
}

function isRateLimitMessage(message) {
  return /rate.?limit|too many requests|quota|resource_?exhausted/i.test(message ?? "");
}

/** Thinking models emit their reasoning as separate parts flagged `thought: true` — only the rest is the actual answer. */
function answerText(parts) {
  return (
    parts
      ?.filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("") ?? ""
  );
}

// Neither Gemini model here supports streamGenerateContent (their own
// model metadata only lists generateContent/countTokens — hitting the
// streaming endpoint doesn't error, it just hangs forever), so this calls
// plain generateContent and delivers the answer as a single delta instead
// of real token-by-token streaming.
async function streamGemini(model, messages, res) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { maxOutputTokens: 2048 },
      }),
    });
    if (!upstream.ok) {
      let message = `Gemini request failed (HTTP ${upstream.status}).`;
      try {
        message = (await upstream.json())?.error?.message ?? message;
      } catch {
        // non-JSON error body — fall through with the generic message
      }
      throw new StreamError(message, upstream.status === 429 || isRateLimitMessage(message));
    }

    const data = await upstream.json();
    const text = answerText(data?.candidates?.[0]?.content?.parts);
    if (!text) throw new StreamError("The model returned an empty response.", false);

    res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
  } catch (err) {
    if (err instanceof StreamError) throw err;
    throw new StreamError(err.message, isRateLimitMessage(err.message));
  }
}

async function streamGroq(messages, res) {
  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        stream: true,
        max_tokens: 2048,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
    if (!upstream.ok || !upstream.body) {
      let message = `Groq request failed (HTTP ${upstream.status}).`;
      try {
        message = (await upstream.json())?.error?.message ?? message;
      } catch {
        // non-JSON error body — fall through with the generic message
      }
      throw new StreamError(message, upstream.status === 429 || isRateLimitMessage(message));
    }

    for await (const event of sseEvents(upstream.body)) {
      if (event === "[DONE]") break;

      let json;
      try {
        json = JSON.parse(event);
      } catch {
        continue;
      }
      // A mid-stream failure (e.g. hitting Groq's daily token quota) arrives
      // as its own SSE event with no `choices` field, no HTTP status to
      // check — only the message text says what happened.
      if (json?.error) {
        const message = json.error.message ?? "Groq returned an error.";
        throw new StreamError(message, isRateLimitMessage(message));
      }

      const text = json?.choices?.[0]?.delta?.content ?? "";
      if (text) res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }
  } catch (err) {
    if (err instanceof StreamError) throw err;
    throw new StreamError(err.message, isRateLimitMessage(err.message));
  }
}

const TIERS = [
  {
    id: "flash-lite",
    label: "Gemini 3.5 Flash Lite",
    run: (messages, res) => streamGemini(GEMINI_FLASH_LITE_MODEL, messages, res),
  },
  {
    id: "gemma",
    label: "Gemma 4 31B",
    run: (messages, res) => streamGemini(GEMINI_FALLBACK_MODEL, messages, res),
  },
  { id: "groq", label: "Compound", run: streamGroq, keyPresent: () => !!process.env.GROQ_API_KEY },
];
const DEFAULT_TIER = TIERS.find((t) => t.id === "gemma");

function resolveTier(requested) {
  return TIERS.find((t) => t.id === requested) ?? DEFAULT_TIER;
}

export function handleAiStatus(req, res) {
  res.json({ enabled: aiEnabled, groqAvailable: !!process.env.GROQ_API_KEY });
}

export async function handleAiChat(req, res) {
  if (!allowRequest(req.ip)) {
    return res.status(429).json({ error: "You're sending messages too fast — wait a bit and try again." });
  }

  const messages = sanitizeMessages(req.body?.messages);
  if (!messages) return res.status(400).json({ error: "That message couldn't be sent — try rephrasing it." });

  const tier = resolveTier(req.body?.provider);
  if (tier.keyPresent && !tier.keyPresent()) {
    return res.status(400).json({ error: `${tier.label} isn't available on this server.` });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // No retry against another model — a rate limit gets an explicit nudge to
  // switch models in the picker instead of the raw upstream text; anything
  // else is forwarded as the provider's own message, same as a real reply.
  try {
    await tier.run(messages, res);
    res.write(`data: ${JSON.stringify({ done: true, provider: tier.id })}\n\n`);
  } catch (err) {
    console.error(`[ai] ${tier.id} failed:`, err.message);
    const message = err.rateLimited
      ? `${tier.label} is rate-limited right now — try switching to a different model.`
      : err.message;
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  }

  res.end();
}
