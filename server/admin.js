import { isAdminUser } from "./roles.js";

export function isAdmin(username) {
  return !!username && isAdminUser(username);
}
