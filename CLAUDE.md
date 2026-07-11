# ashmitbohora.com portfolio

## Current State
- Status: SHIP-CLEAN after the RESTRAINT PASS + CONTENT PASS (both 2026-07-11). NOT yet deployed;
  work sits on branch `polish/restraint-pass` on top of main. Ashmit merges/pushes/deploys himself
  (target Sun Jul 12), then starts MASS internship applications. Full audit + content log:
  ~/SecondBrain/_terminals/2026-07-11-portfolio-giant-audit-FINDINGS.md and
  ~/SecondBrain/_terminals/2026-07-11-portfolio-content-LOG.md
- CONTENT PASS (2026-07-11, verified in Chrome): crafted a real recruiter-ready 1-page resume and
  wired a Download-resume button (hero + finale + footer) -> `/ashmit-bohora-resume.pdf` (committed
  in public/). RESUME SOURCE is `docs/resume.html` (gitignored, local-only per the docs/ convention);
  regenerate the PDF with: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --no-pdf-header-footer --print-to-pdf="public/ashmit-bohora-resume.pdf"
  "file://$(pwd)/docs/resume.html"`. Other edits: masthead now full "Ashmit Bohora" (KEPT ASHMIT'S
  on the receipt); ALL external links open in new tab (target=_blank rel=noopener); 3D patty is now
  grilled-chicken tan (0xc79a5b) with a Hindu note on the Layer-04 chapter; Skills replaced with an
  honest "How I actually build" method section (spec-first + tools keyword line, no self-ratings to
  expose on a whiteboard); PickMyPath reframed honestly (still live at pickmypath.app but PAUSED, not
  "in production"); Sides swapped Life OS -> Warvis and marked BoHub built; footer socials added
  (BohoBites IG + Webspansion, both verified live; TikTok/YouTube/BohosBTS handles could NOT be
  verified so were omitted, do not invent).
- Restraint-pass diagnosis (kept for context): over-quirky overcorrection (mode D), not AI slop, so
  the fix was to SUBTRACT gimmicks. Kept the two signatures (3D burger + receipt); de-skeuomorphed
  the rest.
- AI-VISIBILITY (deep pass, 2026-07-11): crawlers/LLMs render without scrolling and don't wait for
  animations. Verified raw HTML (curl+strip) has ALL content (Astro SSG, 4473 chars). Found + fixed:
  the 6 project chapters were scroll-gated to opacity 0.45 (commit 1bc8227) so a rendering crawler
  saw them dimmed; now always full-opacity. RULE: no content on this site may depend on a scroll
  event or animation firing. If you add motion, gate only decoration, never text.
- Run: `npm run dev` (dev) or `npm run build && npx serve dist -l 4322` (prod preview).
- Stack: Astro 5, plain CSS (src/styles/global.css), one lazy-loaded Three.js island (src/scripts/burger.ts). Two pages: index + 404.
- Restraint pass changes (2026-07-11): froze the receipt at real numbers and removed the count-up
  script (a fast scroll / link-preview could flash "CLIENT SITES SHIPPED: 1"); cut the 100-dish
  striped bar (repeated the receipt's 28); de-skeuomorphed the Sides menu (dropped dot-leaders) and
  the Skills section (dropped Nutrition Facts label chrome, kept the honest Lost..Perfect scale);
  removed burger crumb particles + progress rail; dropped unused Plex Mono 500 weight (5 fonts -> 4).
  NOTE: `.rail`/`.mission`/`.bar`/`.fill` AND the old Skills classes `.skills`/`.sk-row`/`.sk-foot`
  no longer exist (Skills is now `.build`/`.b-row`/`.b-foot`); do not reference the dead ones.
- Verified 2026-07-11 in Chrome (not headless), content pass: hero + patty + method + footer render
  clean with ZERO console errors on a full scroll-through; grilled-chicken patty confirmed;
  Download-resume opens the 1-page PDF (renders 1/1 in Chrome viewer); zero horizontal overflow at
  320/390px (iframe harness); all new content present in raw static HTML (AI-visible, no scroll
  gating); zero em dashes; build passes clean. Restraint-pass checks (WCAG AA contrast, no-JS single
  column, reduced-motion) still hold; content additions are plain static HTML.
- Harness gotchas (for future verification): use extensionless `/__harness` (npx serve 301s
  `.html` and DROPS the query string) and `scrollTo({behavior:'instant'})`. Headless Chrome here
  clamps windows to 500px min, so use the iframe harness for sub-500px checks; hidden-tab
  virtual-time suspends IntersectionObserver (check a VISIBLE tab).
- Open items: post-deploy only: validate og:image with a social-preview debugger once the domain
  resolves. Ashmit's go decides deploy; never push/deploy from a session.
- updated: 2026-07-11 (content pass: resume + download button + honest reframes, verified in Chrome)
