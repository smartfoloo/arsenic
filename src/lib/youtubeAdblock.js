/**
 * Optional Scramjet plugin: strips ad scheduling data out of the player
 * response so in-app video navigation doesn't queue an ad break in the
 * first place.
 *
 * Only reaches YouTube's own client-side navigation (POST
 * /youtubei/v1/player), not the very first full-page /watch load — that one
 * ships its player response inline in the HTML document rather than as a
 * separate JSON fetch, and isn't covered here.
 *
 * Deliberately doesn't also block the ad-tracking/impression pixels
 * (doubleclick, /pagead/, /ptracking, /api/stats/ads) an earlier version of
 * this did — those pixels are how YouTube's ad server learns a session
 * already saw an ad and caps how many more it serves. Blocking them tested
 * worse than doing nothing: every video got ads instead of just the first
 * one, because the server never found out an ad had played.
 *
 * Depends entirely on undocumented YouTube response shapes and Scramjet's
 * internal fetch hook API (@mercuryworkshop/scramjet, alpha as of 2026-08) —
 * expect this to need upkeep as either one changes. The hook body is wrapped
 * so a shape mismatch just falls through to the untouched response instead
 * of breaking playback.
 */

const AD_FIELDS = ["adPlacements", "adSlots", "playerAds", "adBreakHeartbeatParams"];

function isPlayerEndpoint(url) {
  return url.pathname === "/youtubei/v1/player";
}

async function stripAdFields(response) {
  const text = await new Response(response.body).text();
  const data = JSON.parse(text);

  let changed = false;
  for (const field of AD_FIELDS) {
    if (field in data) {
      delete data[field];
      changed = true;
    }
  }
  if (!changed) return;

  response.body = JSON.stringify(data);
  response.headers.delete?.("content-length");
}

/** `ManagedPlugin` is passed in rather than imported — it only exists on
 * `globalThis.$scramjetController` once the controller script has loaded. */
export function createYoutubeAdblockPlugin(ManagedPlugin) {
  class YoutubeAdblockPlugin extends ManagedPlugin {
    constructor() {
      super("youtube-adblock", []);
    }

    install(frame) {
      super.install(frame);

      this.tap(frame.hooks.fetch.response, async ({ parsed }, props) => {
        if (!isPlayerEndpoint(parsed.url) || !props.response?.body) return;
        try {
          await stripAdFields(props.response);
        } catch (error) {
          console.error("youtube-adblock: player response strip failed", error);
        }
      });
    }
  }

  return new YoutubeAdblockPlugin();
}
