import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// A hand-rolled loader instead of a dependency: .env just needs KEY=VALUE
// lines, real environment variables always win over the file.
const envPath = fileURLToPath(new URL("../.env", import.meta.url));

try {
  const contents = readFileSync(envPath, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {
  // no .env file — config comes from real environment variables instead
}
