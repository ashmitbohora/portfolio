# ashmitbohora.com portfolio

## Current State
- Status: SHIP-CLEAN after the RESTRAINT PASS (Fable giant-audit pass 2026-07-11). Ashmit
  gut-checked mid-run that it "still feels very live-coded / receipts are #1 for AI-slop"; the
  correct diagnosis was over-quirky overcorrection (mode D), not AI slop, so the fix was to
  SUBTRACT gimmicks, not add. Kept the two signatures (3D burger + receipt); de-skeuomorphed the
  rest. NOT yet deployed; work sits on branch `polish/restraint-pass` (2 commits) on top of main.
  Ashmit merges/pushes/deploys himself (target Sun Jul 12), then starts the first batch of
  internship applications. Full audit: ~/SecondBrain/_terminals/2026-07-11-portfolio-giant-audit-FINDINGS.md
- Run: `npm run dev` (dev) or `npm run build && npx serve dist -l 4322` (prod preview).
- Stack: Astro 5, plain CSS (src/styles/global.css), one lazy-loaded Three.js island (src/scripts/burger.ts). Two pages: index + 404.
- Restraint pass changes (2026-07-11): froze the receipt at real numbers and removed the count-up
  script (a fast scroll / link-preview could flash "CLIENT SITES SHIPPED: 1"); cut the 100-dish
  striped bar (repeated the receipt's 28); de-skeuomorphed the Sides menu (dropped dot-leaders) and
  the Skills section (dropped Nutrition Facts label chrome, kept the honest Lost..Perfect scale);
  removed burger crumb particles + progress rail; dropped unused Plex Mono 500 weight (5 fonts -> 4).
  NOTE: `.rail` and `.mission`/`.bar`/`.fill` no longer exist; do not reference them.
- Verified 2026-07-11 in Chrome (not headless): burger animates clean with ZERO console errors;
  no-JS collapses to the semantic single-column layout (no void); zero horizontal overflow at
  320/390px (iframe harness); WCAG AA contrast on all text (body 4.72:1, buttons 5.62:1);
  reduced-motion correct; all numbers cross-check RESUME.md + PROFILE.md.
- Harness gotchas (for future verification): use extensionless `/__harness` (npx serve 301s
  `.html` and DROPS the query string) and `scrollTo({behavior:'instant'})`. Headless Chrome here
  clamps windows to 500px min, so use the iframe harness for sub-500px checks; hidden-tab
  virtual-time suspends IntersectionObserver (check a VISIBLE tab).
- Open items: post-deploy only: validate og:image with a social-preview debugger once the domain
  resolves. Ashmit's go decides deploy; never push/deploy from a session.
- updated: 2026-07-11
