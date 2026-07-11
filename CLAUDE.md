# ashmitbohora.com portfolio

## Current State
- Status: SHIP-CLEAN after the RESTRAINT PASS + CONTENT PASS + RESUME REPOSITIONING + RESUME PASS 2
  (all 2026-07-11). Resume is Ashmit-approved as of the pass-2 terminal. NOT yet deployed; work sits
  on branch `polish/restraint-pass` on top of main. Ashmit merges/pushes/deploys himself (target Sun
  Jul 12), then starts MASS internship applications. Full audit + content log:
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
- Open items: (1) Add the Merner Scholarship to the Layer-06 UT chapter on the SITE itself (resume
  Honors line is done, the on-site chapter copy is not); (2) Ashmit's push/merge/deploy decision
  (target Sun Jul 12), then he starts MASS internship applications. Post-deploy only: validate
  og:image with a social-preview debugger once the domain resolves. Ashmit's go decides deploy;
  never push/deploy from a session.
- updated: 2026-07-11 (resume pass 2: real UT academic data, honors/also-line formatting, Boho/Guruji
  connections, Ashmit-approved, committed 10c1871)
