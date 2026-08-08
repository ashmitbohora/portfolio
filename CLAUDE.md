# ashmitbohora.com portfolio

## Current State
- 2026-08-08: TRUTH PASS committed LOCALLY (`7b6446e`), NOT deployed; live site still serves the
  stale build until Ashmit's go. Fixed: (1) the hero dek STILL said "as their AI automation intern"
  on the live site, because the 07-22 purge grepped only the capitalized "AI Automation Intern" and
  missed this lowercase instance; now "Growth & AI Automation lead". RULE: after any title/fact
  change, grep the BUILT dist with `grep -ri intern | grep -vi "internship\|internal"`. (2) Warvis
  152 -> 229 passing tests in index.astro (body + stat) and llms.txt (resume page already said 229,
  homepage contradicted it). (3) Ocura proof figcaption now links ocuraeyehealth.org (client's own
  domain, verified identical site to ocura.prospansion.com, both 200). Build green, dist grepped
  clean, hero re-screenshot verified. Full link check all-200 (LinkedIn 999 = bot block, apex
  pickmypath.app has no DNS but the site only links app.pickmypath.app). Slop audit verdict: 3/10,
  authored-premium, keep the diner signature, do not add more skeuomorphic props. Report:
  /Users/ashmitbohora/SecondBrain/Knowledge/burns/2026-08-08-portfolio-upgrade-pass.md
  Deploy on his go: `npm run build && npx wrangler pages deploy dist --project-name=ashmitbohora`.
- 2026-07-22: RESUME REBUILT IN JAKE'S-STYLE + DEPLOYED LIVE (commit `4f1238c`, pushed to origin,
  deployed to Cloudflare Pages on Ashmit's explicit "push my site" go). The canonical PDF
  `public/ashmit-bohora-resume.pdf` is now a Jake's-Resume-style single-column ATS-safe layout
  (centered name/contact, small-caps section rules, serif, 1 page, 131576 bytes). Ashmit picked this
  over the prior food-brand-adjacent sheet styling after seeing both rendered. PDF source is still
  `docs/resume.html` (gitignored, local-only); the PREVIOUS version is saved at
  `docs/resume-PREVIOUS-20260722.html.bak` if he ever wants it back.
  CONTENT FIXES (truth pass): the WLF job title no longer says "Intern" anywhere. Ashmit became a
  regular 1099 team member on 2026-07-20, so "Growth & AI Automation Intern" was removed from the
  resume, the /resume page, the homepage lead (`src/pages/index.astro`), the JSON-LD schema in
  `src/layouts/Base.astro`, AND `public/llms.txt`. It was in all five, so grep `AI Automation Intern`
  before assuming it is clean. Warvis test count 152 to 229 (verified against the warvis repo's own
  Current State, 229/229 green 2026-07-21). Added a Guruji real-impact bullet: a cousin canceled a
  $100+/month agency after using Guruji, saving $1,200+/year.
  VERIFIED LIVE via curl (Cloudflare 403s WebFetch): /resume/ 200 with "229 passing tests" and
  "$1,200+ a year" and zero "Intern"; PDF 200 at 131576 bytes; homepage + llms.txt clean.
  Regenerate the PDF with: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  --headless=new --no-pdf-header-footer --user-data-dir=$(mktemp -d)
  --print-to-pdf="public/ashmit-bohora-resume.pdf" "file://$(pwd)/docs/resume.html"`.
  GOTCHA: headless Chrome writes the PDF but then HANGS instead of exiting, so a plain `timeout 30`
  run looks like it failed. Background it, poll for the file to exceed ~100KB, then kill the PID.
  OPEN: Ashmit said he wants to "add more WLF things" to the resume; bullets not yet supplied.
- 2026-07-20: ONLINE-VISIBILITY AUDIT PASS (local-only, commit `e89a87a`, NOT deployed, live site
  still on `61c62b3`, awaiting Ashmit's go). Checked live site health, og:image/twitter-card
  (VERIFIED WORKING, no fix needed), GPA/resume/llms.txt consistency (clean), broken links across
  homepage + /resume/ (zero real breaks), and Google visibility for his name (site not yet
  surfacing in search, most likely normal index lag 8 days after GSC/sitemap submission plus a
  recent domain migration; no site-side cause found; Ashmit should check GSC Coverage report
  himself, cannot log in per guardrail). FOUND + FIXED: the schema.org JSON-LD ItemList in
  `src/layouts/Base.astro` (shared by homepage + /resume/) listed PickMyPath first with no
  "paused" note, contradicting the site's own copy (PickMyPath demoted to "Sides, live, paused")
  and burying Webspansion/omitting Prospansion entirely. Reordered to Webspansion, Prospansion
  (added, was missing), Guruji, BohoQuest, PickMyPath (now notes paused), BoHub. Build verified
  green, JSON-LD re-parsed valid. Full findings log:
  /Users/ashmitbohora/SecondBrain/_terminals/2026-07-20-online-visibility-pass-LOG.md. Deploy
  command when he gives the go: `npm run build && npx wrangler pages deploy dist --project-name=ashmitbohora`.
- 2026-07-18 LATE NIGHT: EVERYTHING DEPLOYED LIVE on Ashmit's explicit "push merge deploy" go.
  Live at https://ashmitbohora.com (curl-verified: community copy, First-video pill, /resume,
  PDF, proof images all 200/present). Live commit = `61c62b3`. Shipped tonight: proof pass
  0d4ef4c, community-service reframe 72679a3 + 98b566e (site/resume/PDF all matching), First
  video pill (IG reel Da86bNfP_Pn), toon burger framing fix abbf739 (fixed zoomed-out camera,
  z=14.2, whole exploded stack always in frame; replaced a scroll dolly he disliked), llms.txt
  refresh 61c62b3. main + sandwich-more-3d both PUSHED to origin. Burger experiments stay
  REJECTED/parked on the branch, not merged.
- 2026-07-18 NIGHT (final call): Ashmit KEEPS the ORIGINAL toon burger; both burger experiments
  (PBR pass 7692240, photoreal photo-layer 09737ca) are REJECTED and parked on branch
  `sandwich-more-3d`. DO NOT merge that branch; it exists only as reference (photo cutout assets +
  scripts/gen-burger-layers.py live there). What SHIPS from tonight, all on main, all LOCAL,
  awaiting his deploy go: commit `72679a3` community-service resume reframe (tagline + Webspansion
  pro-bono bullet + Guruji free-education bullet in docs/resume.html + /resume page + regenerated
  1-page PDF) plus the "First video" pill on the Webspansion brand card linking his first posted
  IG reel (https://www.instagram.com/reel/Da86bNfP_Pn/); commit `98b566e` homepage community copy
  matching the resume (hero "19+ free community sites", Webspansion chapter pro-bono framing,
  Guruji "free community-education PWA"). Deploy (his go only):
  `npm run build && npx wrangler pages deploy dist --project-name=ashmitbohora`.
- 2026-07-18 ~07:10 (overnight terminal): PROOF PASS committed LOCALLY (`0d4ef4c`), NOT deployed;
  live site untouched, awaiting Ashmit's review. Real screenshots now anchor every claim: framed
  proof figures (same border+offset-shadow language) in the WLF, Webspansion, Prospansion, and
  Shipped chapters; Prospansion gets a genuine Ocura BEFORE/AFTER pair (sourced from
  `~/Developer/businesses/prospansion/prospansion-case-studies/ocura/screenshots/`); the receipt
  section pairs the receipt with the live getwebspansion.org/stats page shot ("the receipt runs
  live"). Copy: hero 6K+ label fixed, receipt's weak 73-song line swapped for Warvis 700+ docs.
  WLF stays HIPAA aggregates-only (public site shot + counts). Assets in `public/proof/` (jpeg,
  1280w). Build green, desktop+mobile re-screenshot verified. NOTE: working tree had OTHER
  pre-existing uncommitted edits (Base.astro, resume.astro, llms.txt, resume PDF) from a prior
  session; left unstaged, not mine. Deploy when Ashmit approves:
  `npm run build && npx wrangler pages deploy dist --project-name=ashmitbohora`.
- 2026-07-12 EVENING: `/resume` page DEPLOYED and LIVE. Ashmit's own earlier deploy shipped a build
  predating the /resume commit (live /resume/ 404'd); on his explicit go ("fix that issue") the fix
  was `npm run build && npx wrangler pages deploy dist --project-name=ashmitbohora`, then
  curl-verified https://ashmitbohora.com/resume/ returns 200 with the correct title. Everything on
  main is now live.
- 2026-07-12: NEW `/resume` page (commit d75a469): the approved `docs/resume.html` copy as indexable
  HTML in the site design system, canonical https://ashmitbohora.com/resume/, auto-in-sitemap, PDF
  download CTAs. Build green, Chrome-verified, zero em dashes. Same day off-repo: GSC domain property
  verified under ashmitbohora1@gmail.com (sitemap submitted, homepage indexing requested), Cloudflare
  Managed-robots.txt/AI-block toggle OFF for this zone (live robots.txt = clean AEO allowlist),
  www CNAME + 301-to-apex rule added and verified.
- Status: DEPLOYED to Cloudflare Pages (2026-07-11; latest live commit 8ea365a = resume-site reconcile
  pass [19+ live sites, GPA 3.75, Merner scholarship, Shipped/Brands sections, Hindu joke surfaced] +
  LinkedIn hero CTA + "in a hurry? view plain resume" link, all deployed + verified live same day;
  initial deploy was commit b498d30, project name `ashmitbohora`,
  direct-upload via `wrangler pages deploy dist --project-name=ashmitbohora`, NOT git-connected).
  Live and verified at https://ashmitbohora.pages.dev (homepage 200, resume PDF 200 at correct size).
  Custom domain ashmitbohora.com FULLY MIGRATED same day: Cloudflare zone created (free plan), email
  forwarding preserved (5 MX + 1 TXT records recreated), Namecheap nameservers switched to
  athena.ns.cloudflare.com + pranab.ns.cloudflare.com, custom domain attached to the Pages project
  (status Initializing as of 17:52, propagation typically minutes to a few hours, Cloudflare quotes up
  to 48h). Verify with `curl -sI https://ashmitbohora.com` once it should be live. Driven via
  claude-in-chrome browser automation at Ashmit's explicit request; the wrangler OAuth token is
  zone-read-only (known gotcha, see ~/SecondBrain/Knowledge/cloudflare-workers-gotchas.md) so DNS/zone
  work needs either the dashboard UI or a token with zone-write. Correction: an earlier note here
  claiming a "GitHub-connected host auto-builds" was WRONG, there was never a git-connected host or CI
  for this repo. Full log: ~/SecondBrain/_terminals/2026-07-11-internship-launch-LOG.md
- Resume is Ashmit-approved (pass-2 terminal, then two more wording rounds same day: audit-line clarity
  + Guruji/BohoQuest grouping, then recast the audit/121-test lines as engineering competence not impact
  since neither app has real users yet). Full content history + resume log:
  ~/SecondBrain/_terminals/2026-07-11-portfolio-giant-audit-FINDINGS.md,
  ~/SecondBrain/_terminals/2026-07-11-portfolio-content-LOG.md,
  ~/SecondBrain/_terminals/2026-07-11-resume-pass-2-LOG.md
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
- RESUME REPOSITIONING (2026-07-11, resume-fix terminal, commits 271d88e + 0019daf): rebuilt
  `docs/resume.html` per GM5's repositioning SPEC plus Ashmit's direct overrides, verified 1 page in
  real Chrome each round. Key moves: WLF title changed to "Growth & AI Automation Intern" (no
  invented official-title parenthetical, he confirmed there is none); added an AI-engineer tagline
  under his name; merged Webspansion + Prospansion into one founder Experience entry with labeled
  tiers (Webspansion = free/community tier, 19+ verified live sites; Prospansion = paid technical/
  data arm offering analytics/SEO/automation, with Prospansion Studio CMS as its built flagship, no
  delivered-client-analytics-results claim since Prospansion has 0 paid clients); collapsed Projects
  into 2 clusters (Local-First AI: Warvis + Kiln + "also built" clause for BoHub and the family
  household tool; Shipped Production Apps: Guruji promoted in with a verified multi-track curriculum
  bullet (coding/data-science/digital-literacy/english content files confirmed real, not the frozen
  QuickClaude/Data Decoded brands) + BohoQuest + a PickMyPath/BohoBites "also" clause); added Codex
  to the AI & tooling line; added the Merner Scholarship ($2,000, UT CNS, 2026-2027) to Honors.
  Several inflated claims from the upstream SPEC were caught and corrected against verified source
  facts before writing (Guruji file count, DD/QC deploy status, TikTok Shop revenue, Ocura launch
  status). Zero em dashes, zero invented metrics. Full log:
  ~/SecondBrain/_terminals/2026-07-11-portfolio-resume-fix-LOG.md
- RESUME PASS 2 (2026-07-11, resume-pass-2 terminal, commit 10c1871, Ashmit-approved): applied his
  7 review edits to `docs/resume.html`. Honors line de-bolded to equal weight (was QuestBridge-only
  bold). GPA and coursework replaced with REAL data read directly from his 3 UT grade-report PDFs
  (not guessed): cumulative GPA 3.7505 -> resume now shows 3.75/4.0 (was 3.7); coursework line now
  leads with real Fall 2026 registered courses (Elements of Software Design, Linear Algebra,
  Probability & Statistical Inference) then real completed ones (Intro to Data Science, Statistical
  Thinking, Multivariable Calculus) - the old line named a course ("Introductory Statistics with R")
  that does not exist on his transcript. Both "Also"/"Also built:" continuation lines de-bolded for
  consistency. BohoQuest now connected to BohoBites + Bohos BTS as one Boho family. Guruji curriculum
  bullet now names Data Decoded (data science) and QuickClaude (coding) as tracks INSIDE Guruji, not
  separate shipped projects. PickMyPath kept as "live, paused" (flagged + confirmed with Ashmit
  against a conflicting "under production" instruction in the pass brief; verified truth won).
  Community line now ties Guruji (free education) + Webspansion (free websites) into the
  community/impact story. Verified 1 page via a rendered PDF screenshot (not just page-count),
  zero overflow, zero em dashes. Full log: ~/SecondBrain/_terminals/2026-07-11-resume-pass-2-LOG.md
- RESUME-SITE RECONCILE PASS (2026-07-11, commits b510802 + 281cd07, local-only, NOT deployed):
  walked every site section against the Ashmit-approved `docs/resume.html` and fixed drift. Numbers:
  28 -> 19+ live client sites everywhere (hero, receipt, layer 02, JSON-LD schema, meta description;
  Ashmit's explicit call when asked, since resume says "19+ live" and the two numbers read as
  contradictory side by side), GPA 3.7 -> 3.75. Content: pulled the Hindu chicken-patty joke out of a
  buried parenthetical in Layer 04 into its own legible styled line; added the missing Merner
  Scholarship to the Layer-06 UT chapter (closes the item below). New sections: "Shipped production
  apps" (Guruji + BohoQuest, which the site never mentioned despite being the resume's headline
  projects; links go to the live apps only, not GitHub, since both repos are private and Ashmit hasn't
  decided whether to make them public); "Brands & socials" (Webspansion + Prospansion websites,
  BohoBites Instagram, Bohos BTS TikTok, real verified links only, plus a matching nav entry each so
  they're actually discoverable, not just in the footer). Folded the standalone Warvis Sides entry
  into WLF Club (Warvis was built for/inside the WLF internship, not a separate venture) and updated
  WLF's line to match the resume's backlog-conversion framing. Added Codex + Vercel to the tools line.
  Build clean, zero console errors, zero mobile overflow (verified via Playwright, screenshots in
  session log). TODOs left for Ashmit, not invented: (1) Bohos BTS handle ambiguity, he named it
  "bohos_bts" (underscore) but the only verified-live account is TikTok @bohosbts (no underscore) --
  confirm platform + exact handle; (2) BohoBites TikTok/YouTube were checked in an earlier pass and
  404'd, only Instagram is linked; (3) Guruji/BohoQuest GitHub repos are private, no link shown pending
  his public/private call. Full log: ~/SecondBrain/_terminals/2026-07-11-resume-site-update-LOG.md
- BURGER LAYER REWRITE (2026-07-11, commit 2350af7, local-only, NOT deployed): Ashmit's direct
  feedback was that the burger layers ARE his resume, so the old layer text (PickMyPath, APIs &
  Automation, BohoBites Analytics, "I build AI-native") was stale. Rewrote all 4 to real resume
  content: Layer 01 = WLF Club, Layer 03 = Prospansion, Layer 04 = Local-First AI & Knowledge Systems
  (Warvis/Kiln, Hindu joke now lives here as a standalone aside since it's about the patty position not
  BohoBites specifically), Layer 05 = Shipped Production Apps (Guruji/BohoQuest, replaces the separate
  flat section from the prior pass). PickMyPath and WLF swapped places in Sides vs full-layer status.
  Also fixed: receipt "***" line orphan-wrap (text-wrap:balance), brand cards got platform icons
  (globe/Instagram/TikTok) and support multiple links per brand, footer consolidated from 8 links to 5
  (GitHub/Resume/LinkedIn/Email/Social Media anchor). Build clean, Playwright-verified, zero console
  errors, zero mobile overflow.
- SOCIAL HANDLES WIRED (2026-07-11, commit e59b90c, local-only, NOT deployed): Ashmit supplied real
  Instagram/TikTok/YouTube URLs for Webspansion, BohoBites, Bohos BTS (Prospansion has none yet).
  Brand cards redesigned as icon-only pill buttons (one per platform) since most brands now have 3-4
  links. Resolved the earlier bohos_bts/bohosbts ambiguity: Instagram is bohosbts, no underscore,
  matches TikTok. Handles saved to `~/SecondBrain/Knowledge/brand-social-handles.md` (+ research-index
  line) so future sessions/projects don't re-derive them.
- Open items: (1) Ashmit's push/merge/deploy decision (target Sun Jul 12) on the pass above,
  then he starts MASS internship applications. Post-deploy only: validate og:image with a
  social-preview debugger once the domain resolves. Ashmit's go decides deploy; never push/deploy from
  a session.
- updated: 2026-07-11 (resume-site reconcile pass: numbers matched to resume, new Shipped + Brands
  sections, Warvis folded into WLF, Merner Scholarship added to site, local-only, awaiting deploy go)
