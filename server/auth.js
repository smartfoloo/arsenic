import argon2 from "argon2";
import { Router } from "express";

import { createUser, getUserByUsername } from "./db.js";
import { clearSessionCookie, readSession, setSessionCookie } from "./session.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const loginAttempts = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX_ATTEMPTS;
}

const router = Router();

router.post("/signup", async (req, res) => {
  const { username, password, agreedToLegal } = req.body ?? {};

  if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
    return res.status(400).json({ error: "invalid_username" });
  }
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: "invalid_password" });
  }
  if (agreedToLegal !== true) {
    return res.status(400).json({ error: "must_agree_to_legal" });
  }

  const passwordHash = await argon2.hash(password);

  let user;
  try {
    user = createUser({ username, passwordHash });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "username_taken" });
    }
    throw err;
  }

  setSessionCookie(res, { uid: user.id, username: user.username });
  res.json({ username: user.username });
});

router.post("/login", async (req, res) => {
  const ip = req.ip;
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "rate_limited" });
  }

  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "invalid_input" });
  }

  const user = getUserByUsername(username);
  const valid = user && (await argon2.verify(user.password_hash, password));
  if (!valid) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  setSessionCookie(res, { uid: user.id, username: user.username });
  res.json({ username: user.username });
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({});
});

router.get("/me", (req, res) => {
  const session = readSession(req.headers.cookie);
  res.json({ username: session?.username ?? null });
});

export default router;
