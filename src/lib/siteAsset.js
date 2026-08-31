// Resolved against the page's own directory, not a hardcoded leading slash:
// the normal app is always served from "/" so this comes out identical to a
// plain absolute path, but the static build (tools/build-static.mjs) can be
// dropped at a nested CDN path — a literal "/logos/x.png" always resolves
// against the *http origin's* root (e.g. cdn.jsdelivr.net/), which is never
// where the repo's files actually live, even at the repo's own root.
const HERE = new URL(".", document.baseURI);

export function siteAsset(path) {
  return new URL(path, HERE).pathname;
}
