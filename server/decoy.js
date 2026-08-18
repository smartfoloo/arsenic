import express from "express";

// Serves a fake e-reader app — a close UI/UX clone of a cloud ebook reader
// (own neutral branding, not Amazon's), with a real short story loaded in
// it. It doesn't filter by Host, so it's wildcard by construction: whichever
// domain's traffic gets routed here (by the operator's own reverse proxy
// config) sees the same cover story. Clicking the book title opens what
// looks like an ordinary sign-in modal; the right password sets a cookie and
// reloads in place — it does NOT navigate anywhere. The domain stays the
// same domain throughout; it's the reverse proxy in front (Caddy) that reads
// that cookie on the next request and switches which backend it proxies to,
// decoy or real app, both under the same hostname. The password check itself
// is entirely client-side and not meant to stop anyone who looks at the page
// source — it's cover for casual visitors, not access control.
export function createDecoyApp({ password, cookieName = "reader_session" }) {
  const app = express();
  app.use((req, res) => {
    res.type("html").send(renderDecoyPage({ password, cookieName }));
  });
  return app;
}

const BOOK_TITLE = "Kestrel Point";
const BOOK_AUTHOR = "Idris Calloway";

const FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0f6fb2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M2 5c2-1 5-1.5 8-1v15c-3-.5-6 0-8 1V5z"/>' +
  '<path d="M22 5c-2-1-5-1.5-8-1v15c3-.5 6 0 8 1V5z"/>' +
  "</svg>";

const PAGES = [
  `<h2>Kestrel Point</h2>
   <p class="byline">a novella</p>
   <p>The light turned every eleven seconds, and Thomas Ambrose had counted them so many years running that he no longer needed the clock bolted above the stove to know the time. Eleven seconds of dark, then a white blade sweeping the water, then eleven more. He had married his life to that rhythm the way other men married women, and on Kestrel Point that had always seemed the better bargain.</p>
   <p>The island was three acres of granite and gorse, tethered to the mainland by a supply boat that came Tuesdays, weather allowing. In November it rarely allowed. Thomas had provisioned for that, as he provisioned for everything: tinned fish stacked like bricks, paraffin drummed against the damp, a wireless set in the corner of the kitchen that he serviced with the same patience he gave the lamp itself.</p>
   <p>It was the wireless that had started keeping him up nights.</p>`,

  `<p>Not the news bulletins, which he took at seven and forgot by eight, but something underneath them, arriving after the station in Plymouth signed off and the band went to static. A pattern. Faint, regular, threading through the hiss like a heartbeat heard through a wall.</p>
   <p>He'd noticed it first on a Thursday in October, dismissed it as atmospheric noise, the sort of ghost signal that bounced off the ionosphere on cold nights and meant nothing at all. But it came back the next night, and the next, always a little after midnight, always for exactly the same stretch of minutes before it dissolved back into hiss.</p>
   <p>Thomas had kept a log for eleven years — weather, vessel traffic, the mechanical moods of the lamp — and he added a new column without quite deciding to. <em>Signal, 00:14–00:31.</em> Some nights he wrote nothing else. Some nights, when the pattern seemed to shift, he wrote pages, trying to force sense onto something that resisted it.</p>
   <p>He told himself it was only diligence. A keeper noticed things; that was the job description, whether or not the things noticed meant to be found.</p>`,

  `<p>Before the island there had been a terrace house in Falmouth, and Elena, and six years that Thomas still measured his life against without meaning to. She had been a wireless operator herself, trained during the war and never quite willing to give it up afterward, and their courtship had been conducted partly in the ordinary way and partly in Morse, tapped out on the edge of the kitchen table when words felt too heavy to say plainly.</p>
   <p><em>Stay</em>, she used to send him, three dots and a dash and a pause, when he talked about the lighthouse service and the postings that would take him away for months. He had gone anyway, because the alternative was a desk in an office that made his chest feel bricked in, and she had understood that better than he explained it, which was its own kind of love.</p>
   <p>She had died in the spring before his last posting, quickly and unfairly, the way it so often goes, and Thomas had taken Kestrel Point four months later because solitude that chooses itself is easier to carry than solitude that arrives on its own.</p>
   <p>He did not think of the wireless as a way of reaching her. He was not a foolish man. But he noticed that the signal had started in October, and that October was the month they'd married, and he noticed himself noticing, and said nothing to anyone, because there was no one to say it to.</p>`,

  `<p>By the second week of November he had a notebook full of dots and dashes that refused to resolve into English, or French, or the maritime code he'd learned well enough to read distress calls in his sleep. It wasn't gibberish — gibberish had no rhythm, and this had rhythm the way a sentence has rhythm before you catch the words.</p>
   <p>He tried it as numbers. He tried it backward. On the eleventh night he tried something he was faintly embarrassed by even alone in his own kitchen: he tried it as if it were old code, the private shorthand he and Elena had built between them, half standard Morse and half invention, spelling out endearments neither of them would have said aloud.</p>
   <p>Three letters surfaced first, unmistakably: <em>K</em>, <em>E</em>, <em>S</em>. He stared at them so long the kettle went cold on the stove.</p>
   <p>Not her name. His posting. Someone, somewhere down the coast, was sending the name of his own lighthouse back to him, and he did not know yet whether that was the least eerie explanation or the most.</p>`,

  `<p>The storm came in on the fourteenth, faster than the forecast had promised, the barometer dropping like something falling down a stairwell. Thomas spent the afternoon lashing the boat shed and checking the lamp's mechanism twice over, because a keeper's first loyalty was never to his own comfort but to the vessels that would be out there trusting his eleven seconds of light to mean the difference between a course correction and a reef.</p>
   <p>By nine the wind had a voice, a long continuous howl through the gap in the rocks the islanders had named, without much affection, the Whistle. Rain came sideways. The generator coughed twice and held. Thomas stood in the lamp room longer than he needed to, watching the beam cut through water that seemed determined to swallow it, and felt the old, clean fear of the job settle into him — not fear of the storm exactly, but fear of failing the thing the storm was testing.</p>
   <p>He did not expect the wireless that night. Storms usually buried the signal entirely, the static so thick that even Plymouth came through like something drowning.</p>
   <p>Instead, at fourteen minutes past midnight, it came through clearer than it ever had.</p>`,

  `<p>He took it down with a hand that was not quite steady, and this time the letters arrived in whole words, spaced and patient, as if whoever sent them had finally trusted the channel to hold.</p>
   <p><em>KESTREL POINT LIGHT VISIBLE FROM HERE. WHO KEEPS IT.</em></p>
   <p>Thomas sat with that for a long moment. It was, when he made himself look at it plainly, the least mysterious sentence in the world — a question any operator on that stretch of coast might send another, the ordinary courtesy of two lonely stations checking that someone was awake at the far end of the dark. He had simply never had anyone to send it to him.</p>
   <p>His hand found the key before his mind had finished deciding.</p>
   <p><em>T. AMBROSE KEEPS IT. WHO ASKS.</em></p>
   <p>The reply took longer than he liked, long enough that he began composing the disappointment he'd feel if it never came, and then the set crackled back to life.</p>
   <p><em>M. OKAFOR. DEVIL'S SPIT STATION. SEVEN YEARS DECOMMISSIONED BUT SOMEONE HAS TO KEEP THE VALVES WARM.</em></p>`,

  `<p>Devil's Spit was eleven miles down the coast, a station Thomas had known only as a name on the chart and a dark stretch on nights when its own light had still worked, before the Trinity House budget cuts closed it and left whatever equipment still functioned to rust with dignity. He had not known anyone kept it warm.</p>
   <p>They talked — if the word applied to a conversation built from dots and dashes across a storm — for the better part of an hour. Mira Okafor was not, it emerged, a ghost, an operator's widow, or any of the half-formed shapes his mind had been assembling in the dark. She was thirty-one, ran weather relay for a marine survey outfit out of the decommissioned station because the pay was decent and the isolation suited her, and had noticed his light three months ago and started sending to it the way a person might wave at a lit window on a dark road, without much hope of a wave back.</p>
   <p>The earlier signals, the ones he'd spent a fortnight decoding like scripture, had been nothing stranger than her testing the set after a repair, sending the same string of letters over and over the way you'd say a word aloud to see if it still worked. <em>KES TREL PO INT</em>, badly spaced, badly sent, meaning nothing at all until tonight, when the storm had cleared enough air between the stations for a proper signal to land.</p>
   <p>Thomas found he was smiling in a way his face had nearly forgotten how to do.</p>`,

  `<p>He told her about the log, the eleven-year column of weather and vessels, and after a pause admitted the newer column too, the one he'd labeled <em>Signal</em> without knowing whose voice he was recording. He did not tell her about Elena, not that night, though something in the shape of what he did say must have carried the outline of it, because Mira's reply, when it came, was gentler than the question warranted.</p>
   <p><em>SOUNDS LIKE YOU WERE LISTENING FOR SOMEONE FOR A WHILE BEFORE I CAME ALONG.</em></p>
   <p>He looked at that for a long time before he answered, the lamp turning its patient eleven seconds through the window behind him, the storm easing at last into ordinary rain.</p>
   <p><em>SUPPOSE I WAS. GOOD PRACTICE, THOUGH. MADE ME QUICK ENOUGH TO CATCH YOU.</em></p>
   <p>Her laugh did not travel down a wire in dots and dashes, but he heard it anyway, in the particular quickness of the reply that followed, and in something that had loosened in his own chest for the first time in longer than he wanted to count.</p>`,

  `<p>They agreed, before the band went back to static near two in the morning, to a standing time — half past midnight, when Plymouth signed off and the channel was theirs. Not every night; Mira's relay work had its own demands, and Thomas would not let the lamp's needs come second to anything, not even this. But a fixed point, all the same, the kind two people build a week around without quite calling it that yet.</p>
   <p>He went up to check the lamp once more before he let himself sleep, out of habit more than need, and stood a while in the small glass room watching the beam go out over water that had calmed to a sullen swell. Eleven miles down the coast, he knew now, another light was dark and another person was awake anyway, keeping valves warm for no one who'd asked her to, the way he'd kept a log for a signal he could not have explained to anyone who'd asked him to justify it.</p>
   <p>It occurred to him, not for the first time but freshly, that the sea did this — took two isolations and, if you were patient and a little lucky, ran a wire between them.</p>`,

  `<p>Winter came in properly after that, the way it always did on Kestrel Point, sealing the island under short grey days and long black ones, and Thomas kept the light exactly as he always had, eleven seconds of dark and a white blade over the water. But the log had a new shape to it now. Weather. Vessels. And under <em>Signal</em>, no longer a mystery to be decoded but an appointment to be kept — half past midnight, most nights, two operators trading the small news of small islands until the static came back to reclaim the channel.</p>
   <p>He did not know yet what the spring would make of it, whether an eleven-mile stretch of cold water could be crossed by anything sturdier than dots and dashes, or whether it would stay exactly what it was, which was already more than he'd let himself want in a long time. He found, turning the question over the way he turned the pages of the log, that he did not need to answer it tonight.</p>
   <p>The light kept turning. Somewhere down the coast, another keeper who was not a keeper of anything but her own choosing was keeping valves warm and, he suspected, watching for his beam the way he had once, without knowing it, been watching for hers.</p>
   <p class="end">The End</p>`,
];

function renderDecoyPage({ password, cookieName }) {
  const pagesJson = JSON.stringify(PAGES);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BOOK_TITLE} — Cloud Reader</title>
<meta name="description" content="Read ${BOOK_TITLE} and thousands of other titles online — no downloads, no sign-up required.">
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="book">
<meta property="og:site_name" content="Cloud Reader">
<meta property="og:title" content="${BOOK_TITLE} — Cloud Reader">
<meta property="og:description" content="A quiet lighthouse-keeper novella, free to read online.">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${BOOK_TITLE} — Cloud Reader">
<meta name="twitter:description" content="A quiet lighthouse-keeper novella, free to read online.">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}">
<style>
  :root {
    --bg: #ffffff;
    --panel: #f6f6f4;
    --border: #e4e4e0;
    --text: #1a1a1a;
    --muted: #6b6b68;
    --accent: #0f6fb2;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: var(--panel);
    color: var(--text);
  }
  .toolbar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: 52px;
    padding: 0 16px;
    background: #ffffff;
    border-bottom: 1px solid var(--border);
  }
  .toolbar-left, .toolbar-right {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .toolbar-right { justify-content: flex-end; }
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    padding: 6px;
    display: flex;
    align-items: center;
    border-radius: 4px;
  }
  .icon-btn:hover { color: var(--text); background: var(--panel); }
  .icon-btn svg { width: 19px; height: 19px; }
  .title-block {
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    padding: 4px 10px;
    transition: background 0.15s;
  }
  .title-block:hover { background: var(--panel); text-decoration: underline; }
  .title-block .t { font-size: 0.92rem; font-weight: 600; line-height: 1.1; }
  .title-block .a { font-size: 0.72rem; color: var(--muted); line-height: 1.1; }

  .reader {
    position: relative;
    height: calc(100vh - 52px);
    display: flex;
    align-items: stretch;
  }
  .zone {
    width: 12%;
    min-width: 60px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    user-select: none;
  }
  .zone:hover { color: var(--muted); }
  .zone svg { width: 22px; height: 22px; }
  .page-wrap {
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  .page {
    width: 100%;
    max-width: 640px;
    padding: 48px 32px 24px;
    overflow-y: auto;
    font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif;
    font-size: 1.15rem;
    line-height: 1.75;
  }
  .page h2 {
    font-size: 1.6rem;
    margin: 0 0 2px;
    text-align: center;
    font-weight: 600;
  }
  .page p.byline {
    text-align: center;
    color: var(--muted);
    font-style: italic;
    margin: 0 0 40px;
    font-family: -apple-system, sans-serif;
    font-size: 0.85rem;
  }
  .page p { margin: 0 0 1.1em; text-indent: 1.4em; }
  .page p.byline, .page p.end { text-indent: 0; }
  .page p.end { text-align: center; font-style: italic; color: var(--muted); margin-top: 2em; }
  .pagenum {
    text-align: center;
    color: var(--muted);
    font-size: 0.78rem;
    font-family: -apple-system, sans-serif;
    padding-bottom: 18px;
  }

  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(20, 20, 20, 0.55);
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  .overlay.open { display: flex; }
  .modal {
    background: #fff;
    border-radius: 10px;
    width: 340px;
    padding: 28px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  }
  .modal h2 { margin: 0 0 4px; font-size: 1.3rem; font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif; }
  .modal p.sub { margin: 0 0 20px; color: var(--muted); font-size: 0.85rem; font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif; font-style: italic; }
  .modal label { display: block; font-size: 0.82rem; color: var(--muted); margin-bottom: 6px; font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif; }
  .modal input {
    width: 100%;
    background: #fafafa;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 12px;
    color: var(--text);
    font-size: 0.95rem;
    margin-bottom: 16px;
    font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif;
  }
  .modal input:focus { outline: 1px solid var(--accent); }
  .modal button.submit {
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 11px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif;
  }
  .error {
    color: #c0392b;
    font-size: 0.82rem;
    margin: -8px 0 14px;
    display: none;
    font-family: Georgia, "Palatino Linotype", "Iowan Old Style", serif;
  }
  .error.show { display: block; }
  .modal .close {
    float: right;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0;
  }
</style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-left">
      <button class="icon-btn" title="Library">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>
    <div class="title-block" id="title-trigger">
      <div class="t">${BOOK_TITLE}</div>
      <div class="a">${BOOK_AUTHOR}</div>
    </div>
    <div class="toolbar-right">
      <button class="icon-btn" title="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
      </button>
      <button class="icon-btn" title="Text settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
      </button>
      <button class="icon-btn" title="Bookmark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
      </button>
      <button class="icon-btn" title="Contents">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
      </button>
    </div>
  </div>

  <div class="reader">
    <div class="zone" id="prev-zone">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
    </div>
    <div class="page-wrap">
      <div>
        <div class="page" id="page"></div>
        <div class="pagenum" id="pagenum"></div>
      </div>
    </div>
    <div class="zone" id="next-zone">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  </div>

  <div class="overlay" id="overlay">
    <div class="modal">
      <button class="close" id="modal-close">&times;</button>
      <h2>Sign in</h2>
      <p class="sub">Continue to your account</p>
      <label for="pw">Password</label>
      <input id="pw" type="password" placeholder="••••••••" autocomplete="off" autofocus>
      <p class="error" id="err">Incorrect password.</p>
      <button class="submit" id="submit">Sign in</button>
    </div>
  </div>

  <script>
    const PASSWORD = ${JSON.stringify(password)};
    const COOKIE_NAME = ${JSON.stringify(cookieName)};
    const PAGES = ${pagesJson};

    let idx = 0;
    const pageEl = document.getElementById("page");
    const pagenumEl = document.getElementById("pagenum");

    function render() {
      pageEl.innerHTML = PAGES[idx];
      pageEl.scrollTop = 0;
      pagenumEl.textContent = "Page " + (idx + 1) + " of " + PAGES.length;
    }
    function go(delta) {
      idx = Math.max(0, Math.min(PAGES.length - 1, idx + delta));
      render();
    }
    document.getElementById("prev-zone").addEventListener("click", () => go(-1));
    document.getElementById("next-zone").addEventListener("click", () => go(1));
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
    render();

    const overlay = document.getElementById("overlay");
    document.getElementById("title-trigger").addEventListener("click", () => overlay.classList.add("open"));
    document.getElementById("modal-close").addEventListener("click", () => overlay.classList.remove("open"));

    document.getElementById("submit").addEventListener("click", () => {
      const pw = document.getElementById("pw").value;
      if (pw === PASSWORD) {
        document.cookie = COOKIE_NAME + "=1; path=/; SameSite=Lax; Secure";
        window.location.reload();
      } else {
        document.getElementById("err").classList.add("show");
      }
    });
    document.getElementById("pw").addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("submit").click();
    });
  </script>
</body>
</html>`;
}
