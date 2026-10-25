# Date Invitation

A romantic invitation with a classy off-white design, serif typography, a muted rose accent, and a small original envelope illustration.

**Status: Phase 1 foundation complete for review.** The responsive page and five-stage navigation work. All choices are mock preview data. Final activity selection, scheduling, effects, and answer delivery belong to later phases. Nothing is sent, and no public website has been deployed.

## Preview in your browser — no installation

1. Open the Phase 1 pull request or the `codex/phase1-foundation` branch in GitHub.
2. Open `docs/preview.html` (use **View file** from the pull request file menu).
3. Choose **Download raw file**, then open the downloaded `preview.html` in your browser.
4. Use “Let’s take a look” to explore. Choose a sample preference, go back, and check that it stays selected. “Start again” or refreshing clears the draft.

This single HTML file includes the same compiled CSS, JavaScript, and artwork as the working source. It needs no server, account, API key, or internet connection after downloading. It does not enable live delivery. Do not paste its code into another service.

The exported document was tested through a local HTTP page with network access switched off after loading. The managed cloud browser prohibits `file://` navigation, so direct opening of the downloaded file in a real desktop browser remains a manual check. Actual rendered [desktop](docs/previews/desktop.png), [mobile](docs/previews/mobile.png), and [mobile sample-stage](docs/previews/mobile-sample.png) screenshots are included for immediate visual review.

## Cloud development preview

Run these commands **inside Codex Cloud**, not on the café computer:

```sh
npm ci --ignore-scripts
npm run build
npm run dev
```

The development server prints `http://127.0.0.1:4173/Date-invitation/`. That address belongs to the cloud machine; it is not a public link for your café browser. If your Codex client supplies a port-preview/forwarding control, open port 4173 there. No user-facing port-opening tool was available in this session, so the downloadable HTML and screenshots are the browser-only handoff.

The server is loopback-only by default. It serves the site and the explicit `/Date-invitation/review.html` standalone-review endpoint, not private repository files. It does not deploy anything. Rebuild CSS after HTML/style/class changes. Regenerate the single-file copy after any source change:

```sh
npm run build
npm run preview:export
```

## Checks

```sh
npm test
npm run test:browser
```

Eight Node tests cover state, navigation guards, configuration, and the no-network mock boundary. Ten Python Playwright/browser checks cover the journey, history/focus, sample retention, refresh/reset, keyboard exit, repeated clicks, responsive widths, reduced motion, omitted dinner, disabled JavaScript, the disconnected single-file preview, screenshots, and the local server boundary. Browser checks start and stop their own test servers.

Python Playwright and Chromium were already available in Codex Cloud. `requirements-dev.txt` pins the Python browser-check package for another cloud environment; it is not a website runtime dependency. The tests use system Chromium when available, otherwise a Playwright-installed Chromium. The compiled CSS and review HTML are checked in; no package installation is needed to use the single-file preview.

## Project documentation

| File | Purpose |
| --- | --- |
| [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) | Full scope and source distinctions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture, state, and planned future structure |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Phases and acceptance criteria |
| [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md) | Client decisions and engineering defaults |
| [PHASE1_REVIEW.md](PHASE1_REVIEW.md) | Completed scope, tests, screenshots, limits, and next task |
| [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md) | Uploaded-reference evidence and its limits |
| [VERIFICATION.md](VERIFICATION.md) | Historical Phase 0 evidence and Phase 1 verification |
| [ASSET_LICENSES.md](ASSET_LICENSES.md) | Original artwork, fonts, and dependency notices |
| [AGENTS.md](AGENTS.md) | Guidance for future Codex tasks |

## Repository and remaining decisions

Phase 1 starts from latest main commit `dc4b1ebfc1c53b72d2420186acb5a680644b8286` (the merged Phase 0 pull request) on review branch `codex/phase1-foundation`. Git history and the pull request identify the saved revision. No automatic merge or deployment is authorized.

Final invitation buttons, dinner inclusion/options, available times, and client answer access remain unresolved. The neutral preview button is not approval of Yes/Yes or Yes/No. Web3Forms email remains a proposal; it does not provide a private results dashboard. Optional music, hearts, Animate.css, and confetti are deferred.

After visually reviewing Phase 1, resolve Q01–Q03 before authorizing Phase 2. No later phase starts automatically.
