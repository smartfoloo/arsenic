// Roles are static, configured entirely via ARSENIC_ROLES — no DB table, no UI to manage them.
// Format: "Name:color:user1,user2|Name2:color2:user3" (color must be one of ROLE_COLORS).
// A user can be listed under multiple roles; order in the string sets rank (first = highest).
// Roles named "admin" or "owner" (case-insensitive) grant admin access — this replaces the
// old ARSENIC_ADMIN_USERNAMES env var entirely, so admin is now just a role like any other.
export const ROLE_COLORS = [
  "red",
  "peach",
  "yellow",
  "green",
  "teal",
  "sapphire",
  "blue",
  "lavender",
  "mauve",
  "pink",
];

const ADMIN_ROLE_NAMES = new Set(["admin", "owner"]);

const roleDefs = []; // in rank order, highest first
const roleMembers = new Map(); // username(lower) -> Set<roleName>

for (const entry of (process.env.ARSENIC_ROLES ?? "").split("|")) {
  const [name, color, usersRaw] = entry.split(":");
  if (!name || !color || !usersRaw) continue;
  if (!ROLE_COLORS.includes(color)) continue;

  const trimmedName = name.trim();
  roleDefs.push({ name: trimmedName, color });

  for (const username of usersRaw.split(",")) {
    const key = username.trim().toLowerCase();
    if (!key) continue;
    if (!roleMembers.has(key)) roleMembers.set(key, new Set());
    roleMembers.get(key).add(trimmedName);
  }
}

// Role names in rank order (highest first) — lets clients group members by role
// even for roles nobody online currently holds as their top rank.
export function roleOrder() {
  return roleDefs.map((role) => role.name);
}

// All roles a user holds, sorted highest rank first.
export function getRoles(username) {
  const names = roleMembers.get(username.toLowerCase());
  if (!names) return [];
  return roleDefs.filter((role) => names.has(role.name));
}

export function isAdminUser(username) {
  return getRoles(username).some((role) => ADMIN_ROLE_NAMES.has(role.name.toLowerCase()));
}
