const ADMINS = new Set(
  (process.env.ARSENIC_ADMIN_USERNAMES ?? "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdmin(username) {
  return !!username && ADMINS.has(username.toLowerCase());
}
