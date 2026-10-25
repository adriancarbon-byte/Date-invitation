# A little invitation

**Phase 2A romantic redesign, ready for review.** A centered, off-white invitation with original pastel SVG artwork, local serif fonts, a real calendar, illustrated preference cards, and a personal keepsake ending. Everything is mock-only: nothing is sent or booked.

## Open the preview — no installation

Download [docs/preview.html](docs/preview.html) from the `codex/romantic-redesign` branch or its draft pull request, then open the downloaded HTML in your browser. It is one offline file with all artwork, fonts, CSS, and JavaScript embedded. No server, account, key, or installation is needed. GitHub's source viewer does not run HTML; use **Download raw file**.

Choose either **Yes!** or **Yes, of course!**, enjoy the brief celebration, pick an available date and a sample time, optionally choose foods, then pick an activity. The final view shows your actual choices and the exact supplied note. **Copy our little plan** copies locally, with a selectable text fallback if clipboard permission is unavailable. **Not now** is a stable, respectful exit.

Dates are exactly October 28–29 and November 1–30, 2026, using Asia/Manila. Past dates and elapsed sample times are unavailable. After November 30, new availability must be confirmed; the app never extends the year. Refresh or **Start again** clears the in-memory draft. Browser Back/Forward and app Back preserve selections during the session. No choices are stored in the URL, cookies, or browser storage.

Food and time slots are provisional development fixtures in [assets/js/config.js](assets/js/config.js). Disable `dinner.enabled` to omit the food step; `multiple` and `required` configure its behavior. Final food options, actual available hours, and answer delivery still need decisions.

## Review evidence

[PHASE2A_REVIEW.md](PHASE2A_REVIEW.md) records the design comparison, render/critique/improve loop, checks, limitations, and screenshot index. Actual desktop and mobile captures for all seven requested views are in [docs/previews/phase2a/](docs/previews/phase2a/). These use synthetic mock choices and a fixed October 25, 2026 test clock.

## Development and verification

Run inside the development environment:

```sh
npm ci --ignore-scripts
npm run build
npm run preview:export
npm test
npm run test:browser
npm run dev
```

The dev server prints `http://127.0.0.1:4173/Date-invitation/`, a loopback address inside the development environment. It is not a public link. The server exposes site assets and `/Date-invitation/review.html`, while blocking repository metadata and private development files. Stop with Ctrl+C. Browser tests own and stop separate test servers.

The static app retains HTML5, vanilla JavaScript modules, centralized state, and Tailwind/CLI 4.3.3 compiled locally. No runtime framework, remote font service, tracker, live form endpoint, API key, or deployment workflow is included. Fonts and artwork notices are in [ASSET_LICENSES.md](ASSET_LICENSES.md).

## Source and scope

Review branch: `codex/romantic-redesign`, based directly on Phase 1 commit `df96a2bdcaef6f863dd656989d788fc5c0a78caa`. The draft pull request targets `codex/phase1-foundation`, preserving PR #2 and main. No merge, deployment, Pages configuration, email, or live Web3Forms integration is part of this work.

[PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), and [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md) distinguish the current Phase 2A authorization from historical planning. [PHASE1_REVIEW.md](PHASE1_REVIEW.md) preserves the previous checkpoint. [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md) records historical reference evidence and the current text-only reference. [VERIFICATION.md](VERIFICATION.md) links verification evidence by phase.
