// Gate for Caddy's on_demand_tls "ask" check (see index.js's /internal/tls-ask
// route and the Caddyfile). Any hostname pointed at this server's IP hits
// this before Caddy will spend a Let's Encrypt issuance on it, so this is
// the only thing standing between "bring your own domain" and someone
// farming free certs for throwaway phishing hostnames off our TLS setup.
//
// Self-serve stays self-serve: a domain that isn't explicitly blocked is
// allowed on sight, no registration step. This only turns away patterns
// that matched the abuse we actually saw in the Caddy logs — chained
// brand-impersonation subdomains on wildcard "any-subdomain resolves to an
// IP" DNS providers.

// These services resolve *any* subdomain (often anything.<ip>.provider.tld)
// straight to an attacker-chosen IP with zero signup, which is exactly what
// makes them attractive for disposable phishing hosts. Legitimate users
// registering their own domain don't need one of these.
const BLOCKED_SUFFIXES = [
  "kozow.com",
  "giize.com",
  "theworkpc.com",
  "backname.io",
  "sslip.io",
  "nip.io",
  "xip.io",
];

// Brand names seen chained together in the abusive hostnames (bank /
// payments / delivery / marketplace impersonation). A single legitimate
// domain might reasonably contain one of these as a word, but stacking
// several of them into one hostname is not something a real registrant
// does.
const BRAND_KEYWORDS = [
  "sberbank",
  "sbermarket",
  "sbermegamarket",
  "nalozhka",
  "yandex",
  "pochta",
  "pochtabank",
  "cdek",
  "ozon",
  "avito",
  "blablacar",
  "youla",
];

const MAX_LENGTH = 30;
const MAX_LABELS = 4;
const MAX_BRAND_KEYWORDS = 1;

// Rate-limit how many *never-seen-before* hostnames can be approved in a
// window. A burst of brand-new domains showing up at once is itself a
// signal, independent of whether any individual one matches a known bad
// pattern yet — this is the backstop for abuse on a suffix or pattern we
// haven't seen before. Domains that already passed are cached and never
// re-counted against the limit, so real repeat visitors are unaffected.
const NEW_DOMAIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_NEW_DOMAINS_PER_WINDOW = 20;

const decisionCache = new Map(); // hostname -> { allow, reason, at }
const CACHE_TTL_MS = 60 * 60 * 1000;

let newDomainTimestamps = [];

function labelCount(hostname) {
  return hostname.split(".").filter(Boolean).length;
}

function matchesBlockedSuffix(hostname) {
  return BLOCKED_SUFFIXES.find((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

function brandKeywordHits(hostname) {
  return BRAND_KEYWORDS.filter((word) => hostname.includes(word));
}

function pruneNewDomainTimestamps(now) {
  newDomainTimestamps = newDomainTimestamps.filter((t) => now - t < NEW_DOMAIN_WINDOW_MS);
}

export function evaluateDomain(rawHostname) {
  const hostname = (rawHostname || "").trim().toLowerCase();
  if (!hostname) return { allow: false, reason: "empty hostname" };

  const cached = decisionCache.get(hostname);
  const now = Date.now();
  if (cached && now - cached.at < CACHE_TTL_MS) return cached;

  if (hostname.length > MAX_LENGTH) {
    const result = { allow: false, reason: `hostname too long (${hostname.length} > ${MAX_LENGTH})` };
    decisionCache.set(hostname, { ...result, at: now });
    return result;
  }

  const badSuffix = matchesBlockedSuffix(hostname);
  if (badSuffix) {
    const result = { allow: false, reason: `blocked wildcard-DNS suffix: ${badSuffix}` };
    decisionCache.set(hostname, { ...result, at: now });
    return result;
  }

  const brandHits = brandKeywordHits(hostname);
  const labels = labelCount(hostname);

  if (brandHits.length > MAX_BRAND_KEYWORDS) {
    const result = { allow: false, reason: `multiple brand keywords chained: ${brandHits.join(", ")}` };
    decisionCache.set(hostname, { ...result, at: now });
    return result;
  }

  if (labels > MAX_LABELS) {
    const result = { allow: false, reason: `too many subdomain labels (${labels})` };
    decisionCache.set(hostname, { ...result, at: now });
    return result;
  }

  // brand keyword + deep-ish nesting together is a stronger signal than
  // either alone, so it gets a lower label threshold.
  if (brandHits.length > 0 && labels > 3) {
    const result = { allow: false, reason: `brand keyword (${brandHits[0]}) with nested subdomains (${labels})` };
    decisionCache.set(hostname, { ...result, at: now });
    return result;
  }

  pruneNewDomainTimestamps(now);
  if (newDomainTimestamps.length >= MAX_NEW_DOMAINS_PER_WINDOW) {
    const result = { allow: false, reason: "too many new domains provisioned recently, try again shortly" };
    // Deliberately not cached: this is a transient load-shedding decision,
    // not a judgment about the domain itself.
    return result;
  }

  newDomainTimestamps.push(now);
  const result = { allow: true, reason: "ok" };
  decisionCache.set(hostname, { ...result, at: now });
  return result;
}
