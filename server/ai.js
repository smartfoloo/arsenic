// Off by default, same opt-in shape as chat: an open-source clone only talks
// to a paid LLM API when its operator deliberately turns it on and supplies
// an OpenAI API key. Gemini and Groq are optional secondaries — the feature
// still works with only the primary key set, it just offers fewer models.
export const aiEnabled = process.env.ARSENIC_AI_ENABLED === "true" && !!process.env.OPENAI_API_KEY;

const LUNA_MODEL = "gpt-5.6-luna";
const GEMINI_FLASH_LITE_MODEL = "gemini-3.5-flash-lite";
const GEMINI_FALLBACK_MODEL = "gemma-4-31b-it";
const GROQ_MODEL = "groq/compound";
const SYSTEM_PROMPT =
  "You are a helpful, concise AI assistant embedded in arsenic, a web browser. Keep answers friendly and to the point.";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 2048;
// Assumed output size for the admission check only (below) — using the real
// per-request ceiling above there would burn most of a deliberately small
// daily budget on a single pre-flight check regardless of how long the
// actual reply turns out to be. Real usage is what actually gets charged,
// via recordUsage, once the response finishes.
const ESTIMATED_OUTPUT_TOKENS = 600;

// Per-IP daily token allowance, shared across every model — not just Luna.
// The actual monthly dollar cap for Luna specifically is a hard spend limit
// set in the OpenAI dashboard (Settings -> Billing -> Limits), not tracked
// here; this is purely about one IP not being the reason a shared budget
// (of whichever kind) gets eaten in a day. Low stakes if a restart resets
// it, same reasoning as requestLog below.
const DAILY_TOKEN_LIMIT = parseInt(process.env.ARSENIC_AI_DAILY_TOKEN_LIMIT, 10) || 2500;
const dailyUsage = new Map();

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function usageToday(ip) {
  const entry = dailyUsage.get(ip);
  return entry?.day === todayUTC() ? entry.tokens : 0;
}

function recordUsage(ip, tokens) {
  const day = todayUTC();
  const entry = dailyUsage.get(ip);
  if (entry?.day === day) entry.tokens += tokens;
  else dailyUsage.set(ip, { day, tokens });
}

// Conservative (over-)estimate for the admission check below, before the
// real token count is known — real usage from the provider is what actually
// gets recorded after a successful response, via recordUsage.
function estimateRequestTokens(messages) {
  const inputChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(inputChars / 3) + ESTIMATED_OUTPUT_TOKENS;
}

setInterval(
  () => {
    const day = todayUTC();
    for (const [ip, entry] of dailyUsage) {
      if (entry.day !== day) dailyUsage.delete(ip);
    }
  },
  24 * 60 * 60 * 1000,
).unref();

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
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
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

    const usageMeta = data?.usageMetadata;
    return usageMeta
      ? { promptTokens: usageMeta.promptTokenCount ?? 0, completionTokens: usageMeta.candidatesTokenCount ?? 0 }
      : null;
  } catch (err) {
    if (err instanceof StreamError) throw err;
    throw new StreamError(err.message, isRateLimitMessage(err.message));
  }
}

/** Returns the real token usage from OpenAI's final SSE chunk (via
 * stream_options.include_usage) so the caller can record it against the
 * per-IP daily allowance above. */
async function streamLuna(messages, res) {
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: LUNA_MODEL,
        stream: true,
        stream_options: { include_usage: true },
        // Luna is on OpenAI's newer reasoning-model parameter convention —
        // max_tokens (what Groq's otherwise-identical endpoint still wants)
        // is rejected outright here.
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
    if (!upstream.ok || !upstream.body) {
      let message = `Luna request failed (HTTP ${upstream.status}).`;
      try {
        message = (await upstream.json())?.error?.message ?? message;
      } catch {
        // non-JSON error body — fall through with the generic message
      }
      throw new StreamError(message, upstream.status === 429 || isRateLimitMessage(message));
    }

    let usage = null;
    for await (const event of sseEvents(upstream.body)) {
      if (event === "[DONE]") break;

      let json;
      try {
        json = JSON.parse(event);
      } catch {
        continue;
      }
      if (json?.error) {
        const message = json.error.message ?? "Luna returned an error.";
        throw new StreamError(message, isRateLimitMessage(message));
      }
      if (json?.usage) {
        usage = { promptTokens: json.usage.prompt_tokens ?? 0, completionTokens: json.usage.completion_tokens ?? 0 };
      }

      const text = json?.choices?.[0]?.delta?.content ?? "";
      if (text) res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }
    return usage;
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
        stream_options: { include_usage: true },
        max_tokens: MAX_OUTPUT_TOKENS,
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

    let usage = null;
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
      if (json?.usage) {
        usage = { promptTokens: json.usage.prompt_tokens ?? 0, completionTokens: json.usage.completion_tokens ?? 0 };
      }

      const text = json?.choices?.[0]?.delta?.content ?? "";
      if (text) res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }
    return usage;
  } catch (err) {
    if (err instanceof StreamError) throw err;
    throw new StreamError(err.message, isRateLimitMessage(err.message));
  }
}

const TIERS = [
  { id: "luna", label: "GPT-5.6 Luna", run: streamLuna, keyPresent: () => !!process.env.OPENAI_API_KEY },
  {
    id: "flash-lite",
    label: "Gemini 3.5 Flash Lite",
    run: (messages, res) => streamGemini(GEMINI_FLASH_LITE_MODEL, messages, res),
    keyPresent: () => !!process.env.GOOGLE_AI_API_KEY,
  },
  {
    id: "gemma",
    label: "Gemma 4 31B",
    run: (messages, res) => streamGemini(GEMINI_FALLBACK_MODEL, messages, res),
    keyPresent: () => !!process.env.GOOGLE_AI_API_KEY,
  },
  { id: "groq", label: "Compound", run: streamGroq, keyPresent: () => !!process.env.GROQ_API_KEY },
];
// Falls back to Gemma when no provider is requested or an unknown one is
// sent, unless a real OPENAI_API_KEY is configured — Luna is meant to be
// the flagship default, but only once its key actually works.
const DEFAULT_TIER = TIERS.find((t) => t.id === (process.env.OPENAI_API_KEY ? "luna" : "gemma"));

function resolveTier(requested) {
  return TIERS.find((t) => t.id === requested) ?? DEFAULT_TIER;
}

export function handleAiStatus(req, res) {
  res.json({
    enabled: aiEnabled,
    groqAvailable: !!process.env.GROQ_API_KEY,
    geminiAvailable: !!process.env.GOOGLE_AI_API_KEY,
    lunaAvailable: !!process.env.OPENAI_API_KEY,
    usageToday: usageToday(req.ip),
    dailyLimit: DAILY_TOKEN_LIMIT,
  });
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

  const estimate = estimateRequestTokens(messages);
  if (usageToday(req.ip) + estimate > DAILY_TOKEN_LIMIT) {
    return res.status(429).json({ error: "You've hit today's AI usage limit — come back tomorrow." });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  try {
    const usage = await tier.run(messages, res);
    const donePayload = { done: true, provider: tier.id };
    if (usage) {
      recordUsage(req.ip, usage.promptTokens + usage.completionTokens);
      donePayload.usageToday = usageToday(req.ip);
      donePayload.dailyLimit = DAILY_TOKEN_LIMIT;
    }
    res.write(`data: ${JSON.stringify(donePayload)}\n\n`);
  } catch (err) {
    console.error(`[ai] ${tier.id} failed:`, err.message);
    const message = err.rateLimited
      ? `${tier.label} is rate-limited right now — try switching to a different model.`
      : err.message;
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  }

  res.end();
}
