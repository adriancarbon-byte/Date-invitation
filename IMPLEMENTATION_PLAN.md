# Implementation roadmap and acceptance criteria

## Current client revision: sealed letter, calendar and playful No

The latest user instruction supersedes earlier date/button restrictions: start with a floating closed letter and the exact caption **“Hey, I want you to open this for me.”** Opening it reveals **Yes** and **No**. No is an explicitly requested joke: activating it moves it to another bounded viewport position with a cute caption; only Yes records acceptance and advances. Preserve keyboard focus, Escape reset, normal browser exit and reduced-motion handling.

**October 30 and 31, 2026 are now approved**, alongside October 28/29 and all November dates: **34 dates before Manila past filtering**. The calendar legend is removed and original romantic sticker artwork surrounds the scheduling card. The original exact final note remains, followed at the bottom by **“One thing is for sure, i like you so much my christine.”** Floating idle choices and small background flowers/stars are also requested. These remain nonessential, pausable decorations with cleanup. Delivery stays mock-only; no deployment or live submission is authorized.

See [CLIENT_REVISION.md](CLIENT_REVISION.md) for implementation, current screenshots, tests and download instructions. Earlier checkpoints below are historical where they conflict with this revision.

## Latest heart and typography revision

The user's follow-up explicitly removes the opening's **Not now** action, the visible “a little invitation.” brand, the top divider, and the “Just a preview. Your choices stay in this tab.” footer notice. These changes supersede earlier requests for that exit/branding. Only **Yes!** and **Yes, of course!** remain on the opening. The six-stage flow and exact question/message/date/activity requirements are retained.

The user also authorizes animated floating/glowing theme-matched hearts, a heart made of smaller hearts spreading after Yes, additional selection feedback, improved typography and UI polish. A fixed decorative pool, pause control, reduced-motion handling and hidden-tab cleanup keep these additions nonessential. Mock-only transport and the explicit ending notice remain intact. Current evidence and download instructions: [HEART_REFRESH.md](HEART_REFRESH.md).

## Current Phase 2A checkpoint

The latest user request explicitly authorizes the redesign and mock interaction portions of the historical Phases 2–4, including a real calendar with provisional times, optional food, the four required activities, exact supplied note, original artwork, bounded motion, tests, offline export, rendered screenshots and draft PR. The original phase prerequisites below are historical; Q01/Q03 are resolved for this review, and unconfirmed food/times remain labeled fixtures. Live delivery, notes collection, music, backend retrieval and release remain outside this task.

- [x] Start from the verified Phase 1 branch and preserve its ancestry.
- [x] Replace the split prototype with focused centered romantic screens.
- [x] Create original coherent SVG artwork and bundle licensed local serif fonts.
- [x] Implement guarded date/time, optional configurable food and single activity choices.
- [x] Preserve navigation, selections, mock-only transport and session reset behavior.
- [x] Add accurate summary, exact romantic note, and local copy/fallback.
- [x] Render, critique, refine and rerender desktop/mobile views.
- [x] Extend logic/browser verification and regenerate the standalone preview.

Commit/push and draft PR results are reported in the final handoff and Git history. No deployment or merge is authorized. See [PHASE2A_REVIEW.md](PHASE2A_REVIEW.md) for actual results and limits.

Status: **Phases 0 and 1 completed for review; Phases 2–6 not started.** Tasks below are a roadmap, not authorization to execute future phases. Requirement IDs refer to [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md); Q IDs refer to [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md).

## Phase 0 — Repository and requirements preparation

Smallest reviewable deliverable: this documentation baseline plus evidence of repository and tooling inspection.

- [x] Identify repository, checkout branch, initial commit, remote main, and original README.
- [x] Inspect the complete tracked file inventory and applicable existing instructions.
- [x] Read the complete handoff; separate current authorization from supporting instructions.
- [x] Inspect uploaded recording and attempt the direct TikTok URL; document limits.
- [x] Save complete scope, source labels, conflicts, unknowns, architecture, and planned structure.
- [x] Define prioritized phases, mock/live boundaries, tests, and deployment acceptance.
- [x] Verify Node assertions, package-registry metadata access, and headless Chromium through Playwright.
- [x] Update README and create AGENTS guidance.
- [x] Verify documentation links, dates, coverage, whitespace, and docs-only scope.
- [x] At the initial Phase 0 checkpoint, leave changes saved and uncommitted for review; no push, build, deployment, or live send occurred in that task.

Evidence: [VERIFICATION.md](VERIFICATION.md). This checklist does not imply client decisions, application behavior, live service delivery, or production browser support have been verified.

### Follow-up: preserve Phase 0 in GitHub

The user subsequently authorized reviewing/correcting the documentation, committing it on `work`, pushing that branch, and creating a pull request to `main`. This preservation task does not authorize Phase 1, a merge, or deployment. Review results are recorded in VERIFICATION.md; the resulting commit and pull request are reported in Git history and the task's completion message. Do not infer a successful push solely from the existence of this plan.

## Phase 1 — Minimal frontend foundation

Status: implemented and tested following the user’s explicit Phase 1 authorization. Smallest testable deliverable: one responsive entry page with neutral placeholder stages and dependable state-preserving navigation. It must not be mistaken for the final invitation.

- [x] Re-read AGENTS and repository status; preserve unrelated edits.
- [x] Choose browser support/history policy, recording Q18/Q19 assumptions without blocking neutral scaffolding unnecessarily.
- [x] Add minimal semantic HTML, native JavaScript modules, configuration, and in-memory state.
- [x] Pin compatible Tailwind/CLI versions, add lockfile and CSS build script, compile local CSS in cloud tooling.
- [x] Establish off-white theme variables, sensible fallbacks, contrast, focus styles, and responsive spacing.
- [x] Add neutral placeholder stages, app forward/back navigation, stage announcements, and focus handling; support optional dinner in stage order.
- [x] Establish mock submission boundary without a live key or network send. No final prank, image catalog, scheduler, music, hearts, or confetti yet.
- [x] Define a modest initial asset/performance budget and document build/preview/test commands.
- [x] Run checks below; update docs and stop for review.

Phase 1 acceptance (R23–R25, R29–R30, R34, R37): CSS builds reproducibly from pinned dependencies; entry page loads under `/Date-invitation/`; no missing CSS/modules; no production Play CDN; back/forward keeps a sample state value without reload; only active-stage controls are tabbable; focus moves to the active heading; no horizontal overflow at 320/390/768/1440 CSS pixels; zoom remains usable; reduced motion avoids mandatory transition delays. No live submission requests occur. Placeholder/test states are clear. Native browser history behavior is documented and checked. These checks passed for Phase 1 in Chromium; see PHASE1_REVIEW.md. Real phone/Safari/Firefox and full screen-reader audits remain future coverage. Browser screenshots and a single-file review export were additionally prepared at the user’s request.

## Phase 2 — Core interactions

Prerequisites: Phase 1 accepted; Q01–Q03 resolved for final behavior. Smallest testable deliverable: an affirmative invitation progresses through enabled dinner/activity choices and can be edited with Back.

- [ ] Implement exact invitation wording and approved buttons; keep respectful decline/exit stable and keyboard/touch usable.
- [ ] Add an escaping-button effect only if specifically approved and bounded within the card, with reduced-motion/keyboard alternatives.
- [ ] Implement dinner only as agreed; mark sample categories as fixtures until approved.
- [ ] Implement City Lights, Around the City, Movie Date, and Arcade with appropriate legally usable optimized images.
- [ ] Track media licenses/attribution; check load failures and alternate text.
- [ ] Provide selected states, clear progression, and back/edit behavior; prevent rapid-click stage skipping.

Acceptance (R02–R03, R09–R13, R23, R26, R37): exactly four confirmed activities; choice survives back/edit; dinner required/optional/omitted configurations behave correctly; pointer/touch/keyboard all work; selection is not communicated by color alone; no inaccessible moving decline; no venue promise. Functional tests use fixture state and mock transport; no service setup needed.

## Phase 3 — Scheduler, validation, and pre-submit review

Prerequisites: approved hours/policy Q05/Q06; notes treatment Q17. Smallest testable deliverable: approved preferences produce a validated, editable summary and a correct normalized payload without sending it.

- [ ] Build exact allowed-date set and usable date control; show Asia/Manila clearly.
- [ ] Implement approved time choices and same-day rules; revalidate on date edit and send.
- [ ] Implement optional notes with approved length cap and safe plain-text rendering.
- [ ] Keep all earlier choices intact while navigating; review/edit before send on scheduler screen.
- [ ] Validate and serialize only allowlisted fields; handle exhausted dates clearly.
- [ ] Write focused logic tests with injected clock and different device timezones.

Acceptance (R04–R06, R14–R18, R24, R36): all 32 original dates are represented before past filtering; Oct 30/31, invalid calendar dates, out-of-year dates, and dates after Nov 30 are rejected. Test Oct 29→Nov 1 gap, Nov 30→Dec 1 expiry, and Manila midnight (`2026-10-28T15:59:59Z`→`2026-10-28T16:00:00Z`). Test a device in UTC and America/Los_Angeles without shifting permitted days. Test invalid/empty time, approved slots, elapsed same-day time per chosen policy, and changing date invalidating time. Verify blank notes, Unicode, newlines, length limit, and markup displayed as text. Missing required choices block sending; omitted dinner is absent from payload. No real service needed.

## Phase 4 — Visual refinement and nonessential effects

Prerequisites: core flow stable; final copy/assets approved for release. Smallest testable deliverable: a restrained visual pass that still works when effects/audio are disabled or fail.

- [ ] Refine typography, spacing, theme, selected/disabled/focus/error states, and transitions.
- [ ] Add minimal Animate.css usage; remove classes/listeners after effects and avoid relying on animation completion alone.
- [ ] Add a bounded heart background with cleanup, visibility pausing, and pause/off/reduced-motion handling.
- [ ] Add one persistent audio element only if a legal track is approved; visible off/on control and safe playback handling.
- [ ] Build summary/success presentation with brief confetti; wire to **clearly labeled mock outcomes only** until Phase 5.
- [ ] Test layout, long text, mobile scrolling, motion settings, unavailable audio/assets, and repeated navigation.

Acceptance (R08, R19–R21, R25–R28, R37–R38): no loss of readability or usability; reduced motion suppresses moving hearts/confetti/transitions; music starts only on gesture and does not restart between stages; no music requirement; bounded effect elements/listeners after repeated use; no continuous confetti; summary remains readable; mock preview never claims an email was sent. If music is not supplied, omit/disable it rather than adding an unlicensed placeholder track.

## Phase 5 — Reliable answer delivery

Prerequisites: Q04/Q07 accepted and configured; Q08/Q09/Q22 policies agreed; working core flow. Smallest testable deliverable: submission state machine passes mock success/failure tests; subsequently one expressly approved live test confirms real delivery to the intended private inbox.

- [ ] Confirm email-only acceptance in the decision register, or stop this route and scope authenticated private retrieval.
- [ ] Confirm provider account/form configuration privately; use only normal public form access key in browser code.
- [ ] Re-check current Web3Forms endpoint/response documentation and applicable limits/spam controls.
- [ ] Check runtime network policy for live-domain access; request supported configuration if needed, without bypassing it.
- [ ] Implement pending lock, HTTP+JSON success check, safe errors, timeout, state preservation, and manual retry.
- [ ] Add attempt identifier and document ambiguous-timeout/duplicate limits; avoid blind automatic retries.
- [ ] Test success, `success:false`, non-JSON, offline, timeout, HTTP 400/429/500, delayed response, and rapid/repeated sends using mocks first.
- [ ] Ensure the true success screen is unreachable until confirmed receipt; show uncertainty after ambiguous timeout.
- [ ] Only after explicit authorization, send a clearly labeled test notification with nonprivate test choices and verify inbox receipt with the client.

Acceptance (R07, R18–R22, R31–R33, R36): validated minimal payload, real provider acceptance, separate inbox confirmation, appropriate private access, no exposed secret/recipient email/response, safe retry preservation, no concurrent duplicates, and documented lack of cross-device deduplication if unsupported. Synthetic tests must not use a real form key. A mock passing does not satisfy live-delivery acceptance. Email acceptance is not an authenticated website dashboard.

If live delivery cannot be tested, report the reason and leave production delivery unverified. Do not claim release readiness solely from mocks. Current Phase 0 does not authorize account setup or live notifications.

## Phase 6 — Release preparation, approval, and deployment

Prerequisites: earlier phases accepted, content/availability current, all release blockers resolved. Smallest reviewable deliverable **before approval**: tested static release candidate, evidence, known limitations, and exact proposed Pages configuration. Deployment is a later, separately authorized action.

- [ ] Run the functional/browser acceptance matrix below against the actual compiled release candidate.
- [ ] Confirm approved copy, activities/dinner/hours, image/music licenses, current dates, and answer-access policy.
- [ ] Inspect actual repository Pages settings/workflows, permissions, and branch behavior without changing them first.
- [ ] Verify deployment output includes entry HTML, compiled CSS, modules, vendor assets, and approved media.
- [ ] Verify no secrets, private conversations, recordings/frames, actual responses, recipient email, debug payload logs, or live mock banners are present.
- [ ] Prepare changes for review and any separately approved commit/push; keep persistence actions explicit.
- [ ] Ask for release approval only after the release candidate and configuration are concrete and reviewable.
- [ ] After explicit release authorization, configure/publish GitHub Pages through the agreed branch or build workflow.
- [ ] Verify deployed HTTPS URL, `/Date-invitation/` asset paths, no errors, mobile/desktop flow, and authorized actual form delivery.
- [ ] Record deployed revision, verification results, and rollback route; do not call the expected URL live before these pass.

Do not enable automatic deployment in earlier phases. When using branch publication, check whether a push will publish automatically. A commit, a push, release approval, provider test permission, and changing Pages settings are distinct actions; report each accurately.

## Acceptance matrix and evidence to capture

| Area | Required evidence before release |
| --- | --- |
| Navigation/state | Affirmative flow, enabled stage sequence, stable decline, back/edit, browser history policy, no reload, no skipped stages |
| Choices | All four confirmed activities; approved dinner inclusion/options; selected state and correction |
| Scheduling | Exact allowlist, gap/expiry, Manila midnight and non-Manila devices, time policy, validation before send |
| Notes/review | Optional notes, length/Unicode/newlines, text-safe rendering, accurate editable summary |
| Submission | Payload allowlist; mock matrix; pending lock; manual retry; true success gate; ambiguous delivery; authorized real inbox verification |
| Keyboard/screen reader | Logical tab order, visible focus, labels/radio semantics, stage/error/loading announcements, inactive stages hidden, usable exit |
| Responsive | 320/390 mobile, 768 tablet, 1440 desktop CSS-pixel widths; portrait/landscape; zoom and long text; no clipping/overflow |
| Browsers | Chromium plus Firefox/WebKit when installed; actual mobile Chrome/Safari checks or clearly reported outstanding coverage |
| Motion/audio | Reduced motion, effects off, bounded particles/listeners, visibility pause, gesture-only audio, blocked playback, continuous shared audio |
| Assets/performance | No broken paths at repo subdirectory, optimized/sized images, licensed media, measured initial budget and mobile behavior |
| Security/privacy | No public secrets/responses/private media; safe notes/errors; no fake private dashboard; minimal data and no unapproved tracking |
| Deployment | Approved source/output, compiled CSS included, actual HTTPS link verified, live behavior verified after authorization |

Automate pure validation/serialization/state/transport checks; use browser tests for behavior. Manually assess visual quality, screen reader experience, and real phones. Do not turn reversible copy-only edits into unnecessary test suites. All website checks in this matrix remain **not run** at Phase 0.

## Mock data versus real configuration

| Can be developed safely with fixtures/mocks | Requires real configuration or client confirmation |
| --- | --- |
| HTML/CSS/state/navigation, focus, responsive placeholders | Approved final labels, dinner decisions, times, personalized copy |
| Exact calendar allowlist and timezone tests | Confirmation of changed availability near release; do not extend dates automatically |
| Cards with licensed temporary assets labeled as examples | Final approved legal assets/music |
| Payload, validation, pending/error/timeout/retry state machine | Verified client form account/public key and accepted delivery model |
| Labeled success preview and confetti behavior | Actual provider receipt and inbox delivery, with explicit live-test permission |
| Local `/Date-invitation/` path checks | Actual Pages settings/permissions and separately approved deployment |

## Exact next instruction

Phase 1 is ready for visual/GitHub review; preview instructions are in [README.md](README.md) and completed scope is in [PHASE1_REVIEW.md](PHASE1_REVIEW.md). After that review, resolve Q01–Q03 and explicitly authorize Phase 2. Q04/Q05 remain needed before their dependent delivery/scheduling phases. Do not start later phases automatically.
