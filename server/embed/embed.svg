<?xml version="1.0" encoding="UTF-8"?>
<!--
  The proxy half of the single-file build. The UI (arsenic.html) iframes this
  document with ?wisp=<wss url>; everything here runs on the embed origin, so
  the service worker and proxy assets are always same-origin no matter where
  the static folder is hosted. The UI talks to it over postMessage:
    parent -> embed: {type:"frame", action:"go"|"reload"|"inspect", url}
    embed -> parent: {type:"ready"} then {type:"nav", url, title, favicon}
-->
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position:absolute;top:0;left:0;overflow:hidden;">
  <script type="text/javascript"><![CDATA[
    (function () {
      "use strict";

      var params = new URLSearchParams(location.search);
      var wisp = params.get("wisp") || "wss://wisp.mercurywork.shop/";
      var base = new URL(".", location.href).href;
      var prefix = new URL("service/scramjet/", base).pathname;
      var controller = null;
      var frame = null;
      var iframeEl = null;
      var last = {};

      function loadScript(src, onload) {
        // Plain createElement("script") in an SVG document makes an SVG
        // script element, which never loads external code — it has to be in
        // the XHTML namespace to be treated as a real HTML script.
        var s = document.createElementNS("http://www.w3.org/1999/xhtml", "script");
        s.src = src;
        s.onload = onload;
        s.onerror = function () {
          console.error("embed: failed to load " + src);
          parent.postMessage({ type: "error", message: "load " + src }, "*");
        };
        document.documentElement.appendChild(s);
      }

      loadScript(new URL("scram/scramjet.js", base).href, function () {
        loadScript(new URL("controller/controller.api.js", base).href, function () {
          var Controller = $scramjetController.Controller;

          navigator.serviceWorker
            .register(new URL("service/scramjet/sw.js", base).href, { scope: prefix })
            .then(function (registration) {
              var worker = registration.installing || registration.waiting || registration.active;
              if (worker && worker.state !== "activated") {
                worker.addEventListener("statechange", function () {
                  if (worker.state === "activated") connect(Controller, registration.active);
                });
              } else {
                connect(Controller, registration.active);
              }
            });
        });
      });

      function connect(Controller, sw) {
        // Full absolute URLs (with origin), not paths — embed.svg is meant to
        // work from any subpath on any host, and the rewriter needs these to
        // resolve correctly from inside a nested proxied document, not just
        // relative to wherever this script happens to be running.
        import(new URL("epoxy3/index.mjs", base).href)
          .then(function (epoxy) {
            return new epoxy.default({ wisp: wisp });
          })
          .then(function (transport) {
            controller = new Controller({
              serviceworker: sw,
              transport: transport,
              config: {
                prefix: prefix,
                scramjetPath: new URL("scram/scramjet.js", base).href,
                injectPath: new URL("controller/controller.inject.js", base).href,
                wasmPath: new URL("scram/scramjet.wasm", base).href,
              },
              // Matches the main app's config (backends.js) — scramjet's own
              // instrumentation throws visibly-caught exceptions on plenty of
              // ordinary sites without anything actually breaking.
              scramjetConfig: { flags: { captureErrors: false } },
            });
            return controller.wait();
          })
          .then(function () {
            // The foreignObject div is parsed after this script, so look it
            // up only once the boot sequence has reached here.
            var host = document.getElementById("frameHost");
            if (!host) throw new Error("frameHost missing");
            iframeEl = document.createElementNS("http://www.w3.org/1999/xhtml", "iframe");
            iframeEl.style.cssText = "width:100%;height:100%;border:none;background:#fff;margin:0;padding:0;";
            host.appendChild(iframeEl);
            frame = controller.createFrame(iframeEl);
            frame.decode = function (href) {
              return $scramjet.unrewriteUrl(href, frame.context);
            };
            parent.postMessage({ type: "ready" }, "*");
            startHeartbeat(sw, controller);
            setInterval(relay, 500);
          })
          .catch(function (error) {
            console.error("embed: connect failed", error);
            parent.postMessage({ type: "error", message: String(error) }, "*");
          });
      }

      // Ported from the main app's startHeartbeat (backends.js): the
      // controller's routing table lives in the service worker's memory, and
      // the browser can evict an idle worker at any time, wiping it. This
      // pings once a second and re-registers within about a second of the
      // worker going stale, instead of relying only on the library's passive
      // revive-on-restart broadcast.
      function startHeartbeat(sw, controller) {
        var heartbeatPrefix = controller.prefix;
        var handling = false;

        navigator.serviceWorker.addEventListener("message", function (event) {
          var info = event.data && event.data.$arsenic$controller;
          if (!info || info.prefix !== heartbeatPrefix || info.alive !== false || handling) return;

          handling = true;
          try {
            controller.setupMessagePort();
          } finally {
            setTimeout(function () {
              handling = false;
            }, 250);
          }
        });

        function ping() {
          try {
            sw.postMessage({ $arsenic$keepalive: { prefix: heartbeatPrefix } });
          } catch (error) {
            // sw reference is gone (e.g. mid-restart); the next tick tries again
          }
        }
        setInterval(ping, 1000);
        ping();
      }

      // The frame is same-origin with this document (the service worker serves
      // it), so its location/title are readable here — unlike from the UI page.
      function relay() {
        var href, doc;
        try {
          href = iframeEl.contentWindow.location.href;
          doc = iframeEl.contentDocument;
        } catch (error) {
          return;
        }
        if (!doc || !href) return;

        // Each frame gets its own randomized sub-prefix under the controller's
        // (also randomized) one, unlike v1's single flat prefix — only the
        // frame itself knows its real prefix/decode.
        var proxied = location.origin + frame.prefix;
        var url = href;
        for (var depth = 0; depth < 5 && url.indexOf(proxied) === 0; depth++) url = frame.decode(url);
        if (!/^https?:/.test(url) || url.indexOf(proxied) === 0) return;

        var title = doc.title || hostOf(url);
        if (url !== last.url || title !== last.title) {
          last.url = url;
          last.title = title;
          postNav();
        }

        var src = faviconSrc(doc, url);
        // iconSrc is only pinned on success, so a fetch that fails (the
        // proxy's request pool can be starved by a heavy page) is retried on
        // the next tick — same behaviour as the regular app's polling.
        if (src && src !== last.iconSrc && !last.iconPending) {
          last.iconPending = true;
          inlineIcon(src).then(function (icon) {
            last.iconPending = false;
            if (icon) {
              last.iconSrc = src;
              last.favicon = icon;
              postNav();
            }
          });
        }
      }

      function postNav() {
        parent.postMessage({ type: "nav", url: last.url, title: last.title, favicon: last.favicon }, "*");
      }

      function hostOf(url) {
        try {
          return new URL(url).hostname.replace(/^www\./, "");
        } catch (error) {
          return "New Tab";
        }
      }

      function faviconSrc(doc, pageUrl) {
        var el = doc.querySelector("link[rel~='icon']");
        var raw = (el && el.getAttribute("href")) || "/favicon.ico";
        if (raw.indexOf("data:") === 0) return raw;
        try {
          if (raw.indexOf(frame.prefix) === 0) raw = frame.decode(new URL(raw, location.href).href);
          return new URL(raw, pageUrl).href;
        } catch (error) {
          return null;
        }
      }

      var MAX_ICON_BYTES = 64 * 1024;

      function inlineIcon(src) {
        if (!src) return Promise.resolve(null);
        if (src.indexOf("data:") === 0) return Promise.resolve(src.indexOf("data:image/") === 0 ? src : null);

        var abort = new iframeEl.contentWindow.AbortController();
        setTimeout(function () {
          abort.abort();
        }, 5000);
        return iframeEl.contentWindow
          .fetch(src, { signal: abort.signal })
          .then(function (res) {
            return res.blob();
          })
          .then(function (blob) {
            if (blob.type.indexOf("image/") !== 0 || blob.size > MAX_ICON_BYTES) return null;
            return new Promise(function (resolve) {
              var reader = new FileReader();
              reader.onload = function () {
                resolve(reader.result);
              };
              reader.onerror = function () {
                resolve(null);
              };
              reader.readAsDataURL(blob);
            });
          })
          .catch(function () {
            return null;
          });
      }

      window.addEventListener("message", function (event) {
        var data = event.data;
        if (!data || typeof data !== "object" || data.type !== "frame") return;
        if (!frame) return;

        if (data.action === "go" && data.url) frame.go(data.url);
        else if (data.action === "reload") frame.reload();
        else if (data.action === "inspect") toggleInspect();
      });

      function toggleInspect() {
        var doc = iframeEl.contentDocument;
        if (!doc) return;
        if (doc.getElementById("eruda")) {
          doc.getElementById("eruda").remove();
        } else {
          var eruda = doc.createElement("script");
          eruda.src = "//cdn.jsdelivr.net/npm/eruda";
          eruda.onload = function () {
            var start = doc.createElement("script");
            start.innerHTML = "eruda.init(); eruda.show();";
            doc.head.append(start);
          };
          doc.head.append(eruda);
        }
      }
    })();
  ]]></script>
  <foreignObject x="0" y="0" width="100%" height="100%">
    <xhtml:div xmlns:xhtml="http://www.w3.org/1999/xhtml" id="frameHost" style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#fff;"></xhtml:div>
  </foreignObject>
</svg>
