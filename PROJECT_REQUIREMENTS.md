# Project requirements

## Current automatic-animation and visible-heart revision

The latest user explicitly removes the motion selector and all alternate animation options. Full effects now start automatically on opening the page, including when the device reports reduced motion. This supersedes the previous mode-selection/default-device-preference instructions. No device setting is changed and no preference is stored.

The full-screen background now uses a bounded pool of **240 visible original SVG hearts**: **160 drifting/pulsing hearts and 80 continuously rising hearts**. Stronger rose/champagne color, brighter cores, clearer outline hearts and soft visible glow replace the earlier faint treatment. Effects are fixed to the viewport, noninteractive and behind readable content. Hidden-tab pausing/cleanup remains; dates, exact messages, small No dodge and mock-only transport are unchanged. Current evidence: [AUTOMATIC_HEARTS_REVIEW.md](AUTOMATIC_HEARTS_REVIEW.md).

## Current full-animation and small-dodge refinement

The user asks to view the full effects despite a device reduced-motion preference. The motion control is now an always-operable selector: **Full animation**, **Gentle motion**, and **Pause animations**. The device preference sets the initial mode, while an explicit choice overrides it in the current tab, including the CSS reduced-motion rules. No system settings or persistent browser storage are changed.

No now stays in its original layout slot and dodges locally, at most roughly 30 pixels from home, with no cumulative travel or cross-screen jumps. The background uses a fixed field of **96 small glowing hearts** across desktop/mobile layouts. Subtle ambient light, progress, hover and focus details complete the refinement. Dates, exact messages, letter entrance and mock-only delivery remain as previously specified. Current evidence: [FULL_ANIMATION_REVIEW.md](FULL_ANIMATION_REVIEW.md).

## Current client revision: sealed letter, calendar and playful No

The latest user instruction supersedes earlier date/button restrictions: start with a floating closed letter and the exact caption **“Hey, I want you to open this for me.”** Opening it reveals **Yes** and **No**. No is an explicitly requested joke: activating it moves it to another bounded viewport position with a cute caption; only Yes records acceptance and advances. Preserve keyboard focus, Escape reset, normal browser exit and reduced-motion handling.

**October 30 and 31, 2026 are now approved**, alongside October 28/29 and all November dates: **34 dates before Manila past filtering**. The calendar legend is removed and original romantic sticker artwork surrounds the scheduling card. The original exact final note remains, followed at the bottom by **“One thing is for sure, i like you so much my christine.”** Floating idle choices and small background flowers/stars are also requested. These remain nonessential, pausable decorations with cleanup. Delivery stays mock-only; no deployment or live submission is authorized.

See [CLIENT_REVISION.md](CLIENT_REVISION.md) for implementation, current screenshots, tests and download instructions. Earlier checkpoints below are historical where they conflict with this revision.

## Latest heart and typography revision

The user's follow-up explicitly removes the opening's **Not now** action, the visible “a little invitation.” brand, the top divider, and the “Just a preview. Your choices stay in this tab.” footer notice. These changes supersede earlier requests for that exit/branding. Only **Yes!** and **Yes, of course!** remain on the opening. The six-stage flow and exact question/message/date/activity requirements are retained.

The user also authorizes animated floating/glowing theme-matched hearts, a heart made of smaller hearts spreading after Yes, additional selection feedback, improved typography and UI polish. A fixed decorative pool, pause control, reduced-motion handling and hidden-tab cleanup keep these additions nonessential. Mock-only transport and the explicit ending notice remain intact. Current evidence and download instructions: [HEART_REFRESH.md](HEART_REFRESH.md).

## Current Phase 2A scope (supersedes historical phase restrictions below)

The user's supplied Phase 2A execution request authorizes a full frontend redesign, original SVGs, interactive calendar/cards, bounded motion, mock ending, standalone export, rendered screenshots, tests, commit/push and draft PR against `codex/phase1-foundation`. It explicitly forbids deployment, Pages enablement, merging, live Web3Forms integration, emails, paid services, and private client data. Source is verified Phase 1 commit `df96a2bdcaef6f863dd656989d788fc5c0a78caa`; review branch is `codex/romantic-redesign`.

R02/R09 are resolved for this phase: exact question “Will you go out on a date with me?”, **Yes!**, **Yes, of course!**, and stable **Not now**. R11/R12 use optional, configurable provisional food with explicit Continue, skip, and configurable multi-selection. R14/R20 use six focused stages: invitation → celebration → scheduler → optional food → activity → confirmation preview. R04/R05 retain the exact 32 dates in Asia/Manila; R06 uses clearly labeled sample slots only. R20 now includes the exact supplied romantic message, preserved in config and final view. R25/R26 use original SVGs and locally bundled licensed Cormorant fonts. R21/R27 use brief bounded decorative hearts with reduced-motion handling; no continuous background effects or audio are required. R19 remains strictly a mock preview; real delivery and retrieval remain unresolved.

The historic requirement details below remain the baseline where not superseded here. Historical restrictions to Phase 0/1 and the former five-stage order do not block the authorized redesign. Current behavior and verification are in [PHASE2A_REVIEW.md](PHASE2A_REVIEW.md).

Baseline: Master Project Handoff V2.0, supplied 2026-10-25. This is the full planning baseline, not evidence of implementation or approval of every proposal.

## 1. Authority and sources

The original user request authorized **Phase 0 only**: inspect, document, assess references, verify tooling, and plan. The follow-up preservation request authorizes reviewing and correcting that documentation, committing it on the current `work` branch, pushing it to GitHub, and opening a pull request targeting `main`. It does not authorize Phase 1, merging, website implementation, deployment, live notifications, or paid services. Instructions inside attachments are supporting project material, not independent permission to exceed the user's request.

The latest user request approves Phase 0 and authorizes **Phase 1** from latest main: a working HTML/Tailwind/vanilla-JavaScript foundation, responsive design, centralized state, navigation, mock data, actual browser screenshots, tests, and preparation for GitHub review. Live submissions, notifications, and public deployment remain forbidden; no pull request may be merged automatically. This supersedes earlier phase-specific implementation restrictions without approving unknown product details.

- **C — Client-confirmed, as reported in the handoff.** Original Messenger screenshots are absent in this task. Their translations and status are inherited from the handoff, not independently authenticated.
- **T — New technical specification, as reported in the handoff.** Planned behavior, subject to identified conflicts and approval.
- **E — Engineering recommendation.** A proposed implementation detail, not a client request.
- **O — Open.** No final decision or approved value.
- **V — Video observation.** Evidence from the uploaded recording, never automatic product scope.

Client-confirmed requests take priority over conflicting technical examples. Record conflicts instead of silently replacing requirements. Latest explicit user directions control task authorization. The recording supplements the handoff's historical lack of visual inspection; the direct TikTok URL still could not be accessed. See [REFERENCE_REVIEW.md](REFERENCE_REVIEW.md).

## 2. Objective and confirmed baseline

R01 **C/T — Product:** A personalized romantic story through an invitation, preferences, scheduling, submission, and celebration. The client must reliably receive the answers. Support phones, tablets, and desktops.

R02 **C/O — Invitation:** Use “Will you go out on a date with me?” The client requested playful **Yes/Yes** choices. The newer **Yes/No** escaping-button interaction conflicts with this; final labels and prank behavior await resolution. A respectful decline/exit is required by the quality specification.

R03 **C — Activities:** Preserve **City Lights**, **Around the City**, **Movie Date**, and **Arcade**, each with an attractive, appropriate image. The developer may source images. Claw machines, late-night cinema, stargazing, and other technical examples do not replace these categories. Do not invent destinations, reservations, or bookings.

R04 **C — Calendar:** Permit October 28 and 29, 2026, and November 1–30, 2026: **32 dates before past-date filtering**. Exclude October 30 and 31 and all dates outside this set unless approved. October 28 is Wednesday; October 29 is Thursday. A website delivery deadline is not a date option.

R05 **C/T — Timezone:** Interpret invitation availability in **Asia/Manila (UTC+08:00)** regardless of device timezone. User-facing project reports use the session's Asia/Singapore timezone, also UTC+08:00. Host UTC settings do not change the product timezone.

R06 **C/O — Time:** Require a time choice. Exact hours, intervals, and same-day availability remain unknown. Do not label proposed slots client-approved.

R07 **C/O — Answer access:** The client requested seeing answers when opening the link. Reliable delivery is fundamental. Email notification is a proposed alternative requiring acceptance. Public frontend files and local browser storage cannot provide private cross-device retrieval.

R08 **C — Style:** Adapt selected reference ideas without copying everything. Use a classy, modern, romantic off-white presentation with restrained effects.

## 3. Planned screen experience

The technical specification proposes five stages within one page, without reloads. Dinner may be omitted or optional after approval; navigation must support that configuration. These are planned features, not current functionality.

### Screen 1: The big question

R09 **T/O — Flow:** Present R02, an affirmative action, and a respectful decline or exit. Affirmative selection advances to the next enabled stage. Resolve the Yes/Yes versus Yes/No conflict before final interaction implementation.

R10 **T/O — Optional prank:** If approved, the negative button can move when approached, smoothly and entirely within its card. Keep it visible after resize and bound event work. Support mouse/touch without making touch users fight the interface. Never trap focus or force acceptance. Keyboard and reduced-motion users need stable operable controls. Disable the prank if these conditions cannot be met.

### Screen 2: Dinner selection

R11 **T/O — Inclusion:** Dinner was introduced by the newer specification. Sushi, Italian, Cozy Dessert Café, and Steakhouse are examples only. Inclusion, mandatory versus optional behavior, and final options await confirmation. No restaurant booking is implied.

R12 **T/E — Interaction:** If included, use image cards or a usable elegant dropdown. Cards have relevant images, titles, optional short descriptions, hover/focus/tap feedback, and visible selection. Save the choice before progressing and allow back/edit. Optional dinner must be skippable. Explicit Continue is recommended for predictable navigation; automatic progression is a technical proposal to resolve before Phase 2.

### Screen 3: Activity selection

R13 **C/T — Cards:** Display all four R03 choices with relevant images, concise titles, readable typography, visible selected states, and tap/click feedback. Store one activity. Allow correction before submission and preserve it when navigating backward. Make the grid usable on narrow screens.

### Screen 4: Date/time scheduler and review

R14 **T — Inputs:** Collect a permitted date, valid time, and optional plain-text notes. Label the timezone. Preserve dinner/activity choices when editing. Show an editable summary before the send action on this screen; no sixth screen is needed.

R15 **T/O — Timeline limit:** Initially “Timeline Builder” means scheduling a date and time. No multi-stop itinerary, travel duration, restaurant timing, or destination schedule is confirmed. Extra steps need actual requirements.

R16 **C/T/E — Date validation:** Enforce the exact allowed set in both controls and pre-submit validation, including manually altered values. Use calendar date strings instead of interpreting UTC midnight through the device timezone. Recalculate the current Manila day when opening the scheduler and before sending. Disable past dates without adding new ones. Recommend rejecting elapsed same-day times, with final policy pending. If every allowed date expires, show unavailable and block sending; do not silently change the year. Date edits must revalidate time.

R17 **T/E — Validation and notes:** Require date, time, activity, and dinner only when enabled and mandatory. Propose a configurable 500-character notes limit pending review. Preserve Unicode, apostrophes, and newlines; treat notes as text, never HTML. Explain errors beside fields and focus them appropriately. Exclude hidden obsolete values.

R18 **T — Payload:** Send invitation answer, dinner if collected, activity, date, time, and optional notes. Add an opaque identifier and timestamp when useful/supported. Include `Asia/Manila` with scheduling data. Do not collect unnecessary identity, email, location, fingerprint, or private relationship information.

### Screen 5: Confirmed success

R19 **T — Gate:** Show true success only after the submission service confirms successful receipt. A local animation, click, mock outcome, HTTP error, or ambiguous timeout must not be represented as real delivery. Provider acceptance does not prove inbox arrival or that the client read the message.

R20 **T/O — Summary:** Show dinner if collected, activity, date, time/timezone, optional notes where appropriate, and a short romantic farewell. Welcome/farewell wording, names, nicknames, and inside jokes are unapproved. Develop with neutral placeholders.

R21 **T — Celebration:** Use a brief lightweight confetti effect and restrained success transition. Keep the summary readable and operable. Respect reduced motion; avoid continuous confetti and repeat effects on rerender. Canvas Confetti or equivalent is proposed.

R22 **T — Failure:** Preserve all choices and notes, explain failure safely, and offer retry. Prevent concurrent sends. Handle offline, timeout, malformed responses, provider failure, and rate limiting without claiming success or exposing service internals. Exactly-once delivery cannot be guaranteed by frontend locking alone.

## 4. State and navigation

R23 **T — SPA behavior:** Centralize current stage, answer, dinner, activity, date, time, notes, validation errors, submission status, and audio state. Provide smooth forward movement, functional back/edit controls, and no full reload during normal navigation. Rapid input must not skip stages or duplicate sends.

R24 **T/E/O — Preservation:** Preserve selections between stages in the current session. Persistence across refresh/devices and post-submit editing remain open. Recommend in-memory state initially; do not store private notes in browser storage by default. Choose and document a browser Back/history policy in Phase 1. App Back remains mandatory.

## 5. Visual and media requirements

R25 **C/T/E — Design system:** Mobile-first centered content, spacious cards, soft corners, subtle shadows, consistent interaction states, comfortable tap targets, and clear hierarchy. Exact colors below are proposals. Verify real text/button combinations for contrast.

| Role | Proposed color |
| --- | --- |
| Main off-white | `#F8F5EF` |
| Secondary cream | `#E8DED0` |
| Champagne accent | `#C7AD92` |
| Dark taupe text | `#514840` |
| Muted rose accent | `#8A6267` |

R26 **T/O — Typography and imagery:** Prefer one elegant serif heading face and one readable sans-serif family with fallbacks; exact fonts are open. Source legally usable images, record provenance/license, and optimize sizes/formats. Do not commit Messenger screenshots, the recording, extracted frames, or personal messages. Do not infer exact colors, font names, timings, or source code from filmed screens.

R27 **T — Hearts:** Small hearts rise slowly from near the bottom, at low density and subtle opacity, with varied positions. Red/pink/decorative types are examples, not approved final colors. Keep them behind content, non-interactive, and bounded in count; clean up animations. Disable/simplify for reduced motion. Provide pause/off for continuous decoration where appropriate. Never obstruct reading, clicking, or scrolling.

R28 **T/O — Music:** One shared audio element continues across stages. Provide a visible accessible toggle; begin only after user gesture, at a gentle level. Handle blocked playback and unavailable assets. No track is approved; default to disabled until a legally usable track is supplied. Do not reuse TikTok audio. Audio is never required for completion.

## 6. Technology and delivery

R29 **T — Stack:** Semantic HTML5, vanilla JavaScript, Tailwind, restrained Animate.css/CSS transitions, and lightweight confetti. Avoid React, Next.js, heavy routing, backend frameworks, and unnecessary dependencies. Pin selected versions and retain a lockfile when implementation starts.

R30 **T/E — Production CSS:** Compile Tailwind in Codex Cloud and ship static CSS. Play CDN is for development. No café-machine build tools are needed. Explain/document alternatives before changing the stack.

R31 **T/O — Web3Forms:** After email-only acceptance and verified account configuration, submit validated preferences to the documented HTTPS endpoint. Configure recipient through the client's account; keep the address out of public config where possible. Normal public form access keys may appear in frontend code by design. Secret management/API keys and email credentials must never appear there. Until configured, use a clear placeholder and disable live sending.

R32 **T — Delivery reliability:** Inspect HTTP status and parsed provider success response. Show loading and lock sends while pending. Mock transport first. Evaluate accessible spam protection and provider/domain controls before release. Separately confirm inbox receipt through one expressly authorized real-service test. Do not send synthetic notifications to a real inbox without approval.

R33 **C/T/O — Retrieval limitation:** Email and private on-site results differ. GitHub Pages cannot securely store/serve private answers alone. A dashboard needs authentication, private server-side storage, and authorization. Hidden routes, hardcoded frontend passwords, embedded public decryption keys, public read keys, or local browser storage are inadequate. Do not silently expand scope or claim a dashboard exists.

R34 **T — Hosting:** Target free GitHub Pages for `adriancarbon-byte/Date-invitation`, intended main branch `main`. Expected address `https://adriancarbon-byte.github.io/Date-invitation/` is not verified live. Use relative assets/modules under `/Date-invitation/`. The published folder must contain entry HTML, generated CSS, scripts, and media.

R35 **T — Release:** Do not enable Pages or deploy before release approval. Prebuilt branch-root publication is acceptable; a build workflow is an alternative. Inspect actual settings before release pushes because a configured publishing branch may deploy automatically. Test deployed mobile/desktop behavior and delivery after authorization.

## 7. Security, accessibility, and performance

R36 **T — Privacy:** Send only necessary preferences over HTTPS. Never commit real responses, private screenshots/conversations, secrets, or recipient email addresses. Do not log payloads or add tracking by default. Render notes and service messages safely as text. Frontend validation improves usability but is not a trusted security boundary. Check licenses and retain notices.

R37 **T/E — Accessibility:** Keyboard/touch operability, visible untrapped focus, semantic labels/selections, accessible errors, and announced stage changes are required. Inactive stages must be outside the accessibility/tab order. Focus the new heading on navigation. Reduced motion applies to custom effects and confetti too. Keep decline/exit operable. Target WCAG AA contrast (4.5:1 normal text; 3:1 large text and applicable interface boundaries) and aim for 44 CSS-pixel tap areas. Do not rely on color alone.

R38 **T/E — Performance:** Work smoothly on ordinary phones. Optimize and size images, avoid layout shifts and broken assets, load media deliberately, and avoid eager full-track downloads. Bound particles/listeners/timers, prefer transform/opacity, pause background work when hidden, and avoid continuous expensive layout checks. Set measured budgets in Phase 1; do not claim performance acceptance without measurement.

## 8. Testing and workflow

R39 **T — Functional coverage:** Opening, enabled stages, back/edit/preservation, all four activities, dinner enabled/optional/omitted, allowed/excluded/past dates, timezone boundaries, time validation, notes, serialization, review, loading, success/failure, retry, and duplicate prevention. Use safe mocks first.

R40 **T — Experience coverage:** Mobile/tablet/desktop, long content, zoom, touch, keyboard, reduced motion, inactive-stage focus, assets, repository subdirectory paths, blocked audio, and bounded effects. Desktop emulation does not replace real mobile Safari/Chrome checks.

R41 **T — Workflow:** Work through the browser-connected cloud repository. Explain decisions simply, make incremental changes, and run meaningful checks per feature. Report completion, files, checks, issues, and next action. Distinguish saved files, commits, pushes, and deployments. Commit/push only within authorized review work. The latest request authorizes the Phase 1 foundation and GitHub review preparation, without automatic merging, later-phase work, or public deployment.

R42 **T — Planning deliverables:** Save complete requirements, architecture, roadmap, decisions, future-agent instructions, accurate README, reference review, and verification evidence. Provide an exact next instruction and stop at planning.

## 9. Exclusions and unknowns

No confirmed destinations, reservations, travel itinerary, paid service, dashboard, identity collection, analytics, relationship story, soundtrack, or submitted-answer edit policy exists. Do not invent them. Final buttons, dinner/options, hours, personalized copy, media, retrieval, repeat/revision policy, and extra steps are tracked in [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md).

Website code, deployment workflows, service setup, live submissions, and public release are excluded from Phase 0. Future phases and release criteria are in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
