# ashmitbohora.com portfolio

## Current State
- Status: SHIP VERDICT GIVEN, READY TO DEPLOY (Fable judgment pass 2026-07-10 night, after the
  pre-ship fixes pass same evening). Burger concept re-questioned by Ashmit and KEPT deliberately:
  first viewport is the fast plain resume, crawlers see the semantic no-JS layer + schema + llms.txt.
  The old "Sunday 11:59pm" deadline was declared arbitrary; ship stands as: Ashmit runs `git push` +
  deploys whenever ready (this weekend), site is DONE, no open build work. Purpose: internship /
  winternship / fellowship applications. NOT yet deployed; 5 local commits on main.
- Run: `npm run dev` (dev) or `npm run build && npx serve dist -l 4322` (prod preview).
- Stack: Astro 5, plain CSS (src/styles/global.css), one lazy-loaded Three.js island (src/scripts/burger.ts). Two pages: index + 404.
- Fable pass verified/fixed: REAL BUG fixed in 5190a7e: `.masthead`/`.hero` padding shorthands
  zeroed `.wrap`'s 32px side padding, so phones showed nav/h1/dek flush against the screen edge
  (desktop hid it via max-width centering); both now `padding-block`. Full scroll-through eyeballed
  at 1440x900 + 390x844 with WebGL on: burger, rail, layer tags, receipt, mission, nutrition all
  correct. "Empty 100-dish progress bar" in headless shots is a synthetic artifact: hidden tabs /
  virtual-time suspend IntersectionObserver, bar fills to 28% on any visible tab.
- Prior pass (same night) verified: no mobile overflow at 320/360/390 (headless clamps to 500px min
  width, use the iframe harness); WebGL-off degrades to the exact no-JS layout; zero em dashes;
  og.png 1200x630; all numbers docs-verified or softened; reduced-motion correct.
- Harness gotchas (for future verification): use extensionless `/__harness` (npx serve 301s
  `.html` and DROPS the query string) and `scrollTo({behavior:'instant'})` (site smooth-scroll
  otherwise animates and shots catch frame one).
- Open items: post-deploy only: validate og:image with a social-preview debugger once the domain
  resolves. Ashmit's go decides deploy; never push/deploy from a session.
- updated: 2026-07-10
