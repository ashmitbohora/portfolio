# ashmitbohora.com portfolio

## Current State
- Status: pre-ship fixes COMPLETE and verified (2026-07-10 night pass). Ship target: Sunday 2026-07-12 11:59pm, Ashmit pushes/deploys himself. NOT yet deployed; local commits only.
- Run: `npm run dev` (dev) or `npm run build && npx serve dist -l 4322` (prod preview).
- Stack: Astro 5, plain CSS (src/styles/global.css), one lazy-loaded Three.js island (src/scripts/burger.ts). Two pages: index + 404.
- Verified this pass: no horizontal overflow at 320/360/390 (the earlier "mobile overflow" was a headless-Chrome artifact; it clamps windows to 500px min width, so `--window-size=390` screenshots crop a 500px layout). WebGL-off now degrades to the exact no-JS layout (js class removed on failure). Zero em dashes in copy. og.png regenerated (1200x630). All on-page numbers cross-checked against docs/RESUME.md + docs/PROFILE.md; three unverifiable claims softened. Reduced motion: rotation/bursts/fades/count-ups disabled, layers snap.
- Verification harness pattern: serve dist, then screenshot `http://localhost:4322/` via an iframe harness for sub-500px widths (see session log 2026-07-10 in ~/SecondBrain/_terminals/).
- Open items: none blocking ship. Ashmit's go decides deploy.
- updated: 2026-07-10
