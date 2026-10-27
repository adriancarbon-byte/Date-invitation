# Just for you

Preventive reliability/security review: [HARDENING_REVIEW.md](HARDENING_REVIEW.md).
Hosting, access boundaries, café-session independence and recovery:
[OPERATIONS.md](OPERATIONS.md). Netlify releases now run automated logic and
packaging/security checks before publishing.


**Live invitation update.** A centered, off-white invitation with original pastel SVG artwork, a coordinated serif/sans/handwritten font palette, floating hearts, a sealed-letter entrance, a playful dodging No, a heart-shaped Yes celebration, a sticker-decorated calendar, illustrated preference cards, and a personal keepsake ending. The hosted version includes an explicit email submission through a private server relay. See [LIVE_DELIVERY.md](LIVE_DELIVERY.md) for the current deployment and delivery behavior; earlier phase documents are historical.

The user has deployed the Netlify invitation and reported an email failure. The [Netlify repair](NETLIFY_DEPLOY.md) changes delivery to the provider-supported browser request after server validation. The template-created production repository is `adriancarbon-byte/Date-invitation-c8933` on `main`; the original source remains on `codex/romantic-redesign`. Live acceptance and inbox receipt still need verification.

## Open the preview — no installation

Download [invitation-preview.zip](docs/invitation-preview.zip), extract it, and double-click **preview.html**. This avoids viewing HTML source in the browser. The [standalone HTML](docs/preview.html) is also available from the `codex/romantic-redesign` branch or its draft pull request. It is one offline file with all artwork, fonts, CSS, and JavaScript embedded. No server, account, key, or installation is needed. GitHub's source viewer does not run HTML; use **Download raw file**.

Open the floating letter, then choose **Yes** to continue. **No** is a playful joke: selecting it gives it a small nearby dodge with a cute caption; it never records acceptance. Yes stays in place. Escape returns No to its starting position. The normal browser controls are unchanged.

Continue through the celebration, date, scrolling hour/minute/AM–PM wheels, optional foods and one activity. Review the final plan, then choose **Send our plan** to email the choices to the inviter. Nothing is sent before that button is selected. The downloaded HTML works offline for review and asks you to use the live link to send.

Dates are exactly October 28–31 and November 1–30, 2026, using Asia/Manila. Past dates and elapsed times are unavailable. After November 30, new availability must be confirmed; the app never extends the year. Refreshing clears the in-memory draft and returns to the closed letter. Browser Back/Forward and app Back preserve selections during the session. No choices are stored in the URL, cookies, or browser storage.

**The complete animation experience starts automatically. There is no animation menu or mode to choose.** The latest user explicitly requests this default even when a device reports reduced motion. Device settings are not changed.

A fixed field of **240 clearly visible hearts** surrounds the screen: 160 drift/glow across it and 80 flow upward continuously. Eight flower/star charms remain. Effects keep their positions across scrolling, stop background work when the tab is hidden, and use bounded element pools. Choices gently float after 4.5 seconds of inactivity until interaction resumes.

The six food choices are confirmed and time selection accepts every minute. Settings remain centralized in [assets/js/config.js](assets/js/config.js). Disable `dinner.enabled` to omit the food step; `multiple` and `required` configure its behavior.

## Review evidence

[AUTOMATIC_HEARTS_REVIEW.md](AUTOMATIC_HEARTS_REVIEW.md) records the current automatic effects and brighter flowing background. [FULL_ANIMATION_REVIEW.md](FULL_ANIMATION_REVIEW.md) records the latest motion controls, heart density and nearby No dodge. [CLIENT_REVISION.md](CLIENT_REVISION.md) records the current letter/calendar/Yes–No revision. [HEART_REFRESH.md](HEART_REFRESH.md) records the latest typography, heart motion and opening cleanup. [PHASE2A_REVIEW.md](PHASE2A_REVIEW.md) records the design comparison, render/critique/improve loop, checks, limitations, and screenshot index. Actual desktop and mobile captures for the letter, invitation/No joke, and planning stages are in [docs/previews/automatic-hearts/](docs/previews/automatic-hearts/). These use synthetic mock choices and a fixed October 25, 2026 test clock.

## Development and verification

Run inside the development environment:

```sh
npm ci --ignore-scripts
npm run build:netlify
npm run preview:download
npm test
npm run test:browser
npm run dev
```

The dev server prints `http://127.0.0.1:4173/Date-invitation/`, a loopback address inside the development environment. It is not a public link. The server exposes site assets and `/Date-invitation/review.html`, while blocking repository metadata and private development files. Stop with Ctrl+C. Browser tests own and stop separate test servers.

The static app retains HTML5, vanilla JavaScript modules, centralized state, and Tailwind/CLI 4.3.3 compiled locally. The ZIP packaging command uses Python 3, already used by the browser checks. There is no browser runtime framework, remote font service or tracker. A small Cloudflare Worker serves the embedded page and validates email submissions. Runtime delivery credentials are kept in the hosting secret store. Fonts and artwork notices are in [ASSET_LICENSES.md](ASSET_LICENSES.md).

## Source and scope

Review branch: `codex/romantic-redesign`, based directly on Phase 1 commit `df96a2bdcaef6f863dd656989d788fc5c0a78caa`. The draft pull request targets `codex/phase1-foundation`, preserving PR #2 and main. The latest request authorizes a separate Sites deployment and Web3Forms email integration. The GitHub branch remains unmerged; main and Pages configuration are unchanged.

[PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), and [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md) distinguish the current Phase 2A authorization from historical planning. [PHASE1_REVIEW.md](PHASE1_REVIEW.md) preserves the previous checkpoint. [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md) records historical reference evidence and the current text-only reference. [VERIFICATION.md](VERIFICATION.md) links verification evidence by phase.
