import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const secretPath = fileURLToPath(new URL("./data/session-secret", import.meta.url));

function loadSecret() {
  if (process.env.ARSENIC_SESSION_SECRET) return process.env.ARSENIC_SESSION_SECRET;

  try {
    return readFileSync(secretPath, "utf8").trim();
  } catch {
    mkdirSync(fileURLToPath(new URL("./data/", import.meta.url)), { recursive: true });
    const secret = randomBytes(32).toString("hex");
    writeFileSync(secretPath, secret, { mode: 0o600 });
    chmodSync(secretPath, 0o600);
    return secret;
  }
}

const secret = loadSecret();
const COOKIE_NAME = "arsenic_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function sign(payload) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function signCookie({ uid, username }) {
  const payload = JSON.stringify({
    uid,
    username,
    iat: Date.now(),
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyCookie(value) {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookieHeader(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    cookies[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return cookies;
}

export function readSession(cookieHeader) {
  const value = parseCookieHeader(cookieHeader)[COOKIE_NAME];
  return verifyCookie(value);
}

export function setSessionCookie(res, { uid, username }) {
  const value = signCookie({ uid, username });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}${secure}`,
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
}
