# Decisions and open questions

## Current client revision: sealed letter, calendar and playful No

The latest user instruction supersedes earlier date/button restrictions: start with a floating closed letter and the exact caption **“Hey, I want you to open this for me.”** Opening it reveals **Yes** and **No**. No is an explicitly requested joke: activating it moves it to another bounded viewport position with a cute caption; only Yes records acceptance and advances. Preserve keyboard focus, Escape reset, normal browser exit and reduced-motion handling.

**October 30 and 31, 2026 are now approved**, alongside October 28/29 and all November dates: **34 dates before Manila past filtering**. The calendar legend is removed and original romantic sticker artwork surrounds the scheduling card. The original exact final note remains, followed at the bottom by **“One thing is for sure, i like you so much my christine.”** Floating idle choices and small background flowers/stars are also requested. These remain nonessential, pausable decorations with cleanup. Delivery stays mock-only; no deployment or live submission is authorized.

See [CLIENT_REVISION.md](CLIENT_REVISION.md) for implementation, current screenshots, tests and download instructions. Earlier checkpoints below are historical where they conflict with this revision.

## Latest heart and typography revision

The user's follow-up explicitly removes the opening's **Not now** action, the visible “a little invitation.” brand, the top divider, and the “Just a preview. Your choices stay in this tab.” footer notice. These changes supersede earlier requests for that exit/branding. Only **Yes!** and **Yes, of course!** remain on the opening. The six-stage flow and exact question/message/date/activity requirements are retained.

The user also authorizes animated floating/glowing theme-matched hearts, a heart made of smaller hearts spreading after Yes, additional selection feedback, improved typography and UI polish. A fixed decorative pool, pause control, reduced-motion handling and hidden-tab cleanup keep these additions nonessential. Mock-only transport and the explicit ending notice remain intact. Current evidence and download instructions: [HEART_REFRESH.md](HEART_REFRESH.md).

## Phase 2A decisions and superseding authorization

Source: user's current Phase 2A execution request, supplied 2026-10-25 (Asia/Singapore); client details are attributed to that request. This authorizes implementation and GitHub review, while forbidding merge/deployment, live submissions, emails and paid services. This section supersedes conflicting historical open entries below for the current phase.

| Affected items | Current decision |
| --- | --- |
| Q01, C02, R02/R09 | Implement **Yes!** / **Yes, of course!**, with stable accessible **Not now**. No escaping button. |
| Q03, E03 | Explicit Continue after choices, preserve selections and permit editing. |
| Q02, R11/R12 | Six sample foods, optional/skippable/configurable; multi-select is a review fixture. Final inclusion/options remain open. |
| Q05/Q06, R06/R16 | Five clearly labeled sample evening slots. Manila past-date filtering required; elapsed same-day samples rejected by configurable engineering policy. Final hours/policy remain open. |
| Q12, R20 | The exact supplied “See you cutie…” message is implemented without rewriting. Other neutral supporting copy is review copy. |
| Q13/Q16, T01 | Use authoritative text-only visual brief; invitation → celebration → schedule → optional food → required activity → mock confirmation. |
| Q20, R25/R26 | Off-white/rose centered design, 15 original SVGs and licensed local Cormorant regular/italic fonts are review choices. No media copied from the reference. |
| Q18 | Preserve Phase 1 in-memory draft/history; refresh/reset clears. No cross-device persistence. |
| Q04/Q07/Q08/Q09/Q22 | Delivery, authenticated retrieval, verified provider setup, response revision/repetition and retention remain unresolved for later scope. |

Current implementation/evidence is in [PHASE2A_REVIEW.md](PHASE2A_REVIEW.md). The following register preserves the historical baseline; do not treat its superseded Q01/Q03 entries or phase restrictions as current blockers.

Status at Phase 0, 2026-10-25. “Confirmed” below means reported as client-confirmed in the handoff; the original screenshots were not supplied. Technical proposals and engineering recommendations remain separate. No unknown is silently approved by this document.

## 1. Client-confirmed baseline

| ID | Requirement | Treatment |
| --- | --- | --- |
| C01 | “Will you go out on a date with me?” | Preserve wording |
| C02 | Playful Yes/Yes choices | Priority over the contradictory Yes/No example; final implementation pending Q01 |
| C03 | City Lights, Around the City, Movie Date, Arcade | Preserve all four categories |
| C04 | Developer may choose suitable pictures | Source licensed appropriate assets; no invented venue promises |
| C05 | October 28/29 and all November dates in 2026 | Exact 32-date set; exclude October 30/31 |
| C06 | Include time selection | Hours and interval remain open |
| C07 | Client can see recipient answers when opening the link | Fundamental outcome; email is not automatically equivalent |
| C08 | Adapt some reference ideas; classy off-white; not too fancy | Priority over literal pink-theme copying or excessive effects |

## 2. New technical-specification scope

| ID | Specification proposal | Status |
| --- | --- | --- |
| T01 | Five-stage SPA: invitation, dinner, activity, scheduler, success | Planned structure; dinner conditional |
| T02 | Yes/No escaping negative button | Conflicts with C02; cannot remove decline/exit |
| T03 | Dinner cards; sample cuisines; automatic progression | Final inclusion/options/requiredness and progression unresolved |
| T04 | Scheduler with optional notes and centralized state | Planned; no real multi-stop itinerary supplied |
| T05 | Hearts, optional continuous music, cinematic success/confetti | Planned restrained effects; track and copy missing |
| T06 | HTML, Tailwind, vanilla JS, Animate.css, Canvas Confetti | Recommended direction, no packages installed |
| T07 | Web3Forms email | Conditional alternative to C07, requires acceptance and configuration |
| T08 | GitHub Pages; responsive/accessibility/security standards | Planned; deployment approval required |

## 3. Proposed engineering decisions

| ID | Recommendation | Reason / approval boundary |
| --- | --- | --- |
| E01 | Single HTML entry, native modules, centralized in-memory state | Smallest adequate SPA; refresh persistence not assumed |
| E02 | Compile Tailwind in cloud; commit prebuilt CSS for simple root publication | Production CSS without café installation or browser compiler |
| E03 | Explicit Continue after card selection | Predictable keyboard/touch experience; resolve against auto-advance before Phase 2 |
| E04 | Exact-date select grouped by month | Only 32 possible dates; min/max alone admits excluded days |
| E05 | Manila calendar validation and recheck at send | Avoid device timezone and overnight errors |
| E06 | Reject past dates; propose rejecting elapsed same-day times | No silent date extension; exact policy Q06 |
| E07 | Optional notes cap of 500 characters | Bound payload/summary; configurable pending confirmation |
| E08 | Mock/live submission adapters, default mock during development | Test safely without notifications |
| E09 | Pending lock, stable attempt ID, manual retry; no exactly-once promise | Timeout may hide already-accepted delivery |
| E10 | Music disabled without approved asset; fixed-pool hearts, brief confetti | Keep effects nonessential, bounded, and accessible |
| E11 | Public form key only; no public retrieval credentials | Static hosting has no secure private data boundary |
| E12 | Root prebuilt Pages publication at release; no workflow yet | Lowest operational complexity; inspect settings before release pushes |

These are recommendations for review, not new client-confirmed requirements or permission to build in Phase 0.

## 4. Conflicts and source reconciliation

| Conflict | Evidence | Recommended resolution |
| --- | --- | --- |
| Yes/Yes versus Yes/No | C02 versus T02 and recording's visible Yes/No | Ask client to choose; recommend playful Yes/Yes with a separate stable “Not now” exit; no prank until approved |
| Answers on reopening the link versus email | C07 versus T07 | Obtain email-only acceptance, or scope a genuinely authenticated results service |
| Original activities versus later alternatives | C03 versus illustrative technical examples | Keep the four confirmed activity categories; examples do not override them |
| Classy off-white versus pink recording/effects | C08 versus reference aesthetic | Adapt spacing/hierarchy/flow ideas; use restrained off-white theme, not literal copying |
| Five screens versus dinner not confirmed | Original conversation lacks dinner; T01/T03 adds it | Make dinner configurable; confirm inclusion/requiredness/options before final content |
| “Timeline Builder” versus no actual itinerary | T04 naming, no stops/durations | Ship a scheduler/review only unless extra requirements arrive |
| Historical “reference unverified” versus new upload | Handoff predates visual review | Direct TikTok remains inaccessible; uploaded recording now inspected with explicit limits |
| Main branch versus actual checkout | Handoff says main; environment checked out work | Retain work; remote main and initial commit verified; do not relabel or switch needlessly |
| Original README claims private tracking | README description only, no implementation | README corrected to planned delivery and unresolved retrieval |
| Reference step order versus technical five stages | Recording appears to schedule before food | Retain proposed five-stage order; recording is inspiration, not a change request |

## 5. Open-requirements register

All entries are **OPEN**. “Needed by” identifies the phase that depends on the answer. Phase 1 may use neutral placeholders; it does not require resolving every item now. The project director obtains client decisions. Do not put private answers in public documentation.

| ID | Exact decision needed | Recommendation / safe provisional treatment | Needed by |
| --- | --- | --- | --- |
| Q01 | Yes/Yes or Yes/No? Is any escaping-button prank wanted, and which decline/exit action? | Prefer Yes/Yes plus stable “Not now”; mock neutral navigation until confirmed | Phase 2 |
| Q02 | Is dinner included, optional, or required? What are its final categories? | Configurable; technical sample cuisines are fixtures only | Phase 2 |
| Q03 | Should cards auto-advance or use Continue? | Recommend explicit Continue; retain choice and permit edits | Phase 2 |
| Q04 | Does email-only answer delivery satisfy the original request to reopen the link and view answers? | This is the main architecture decision. Email is simpler; dashboard requires separately approved authenticated backend | Before live Phase 5 route; earlier if dashboard required |
| Q05 | Which times/hours and interval are actually available? Same schedule on every date? | No invented approved slots; mock values only until confirmed | Phase 3 |
| Q06 | Can today be selected, are elapsed same-day times forbidden, and what happens once all dates expire? | Reject past dates/times; unavailable after Nov 30 rather than silently extending | Phase 3 |
| Q07 | Which verified client account/inbox will receive answers, and can a normal public Web3Forms form key be configured? | Configure privately through provider; never supply email password or secret API key in public files | Phase 5 |
| Q08 | Can a recipient revise an answer after a successful send? If so, how does the client recognize the replacement? | Allow pre-send edits; no post-send overwrite claim without an agreed workflow | Phase 5/release |
| Q09 | Are repeated responses allowed, and what behavior is wanted after success/refresh? | Prevent pending duplicates and discourage resends; cross-device one-response enforcement requires backend support | Phase 5/release |
| Q10 | What real name/nickname, if any, may appear publicly? | Neutral wording; collect privately and use only approved public content | Content polish/release |
| Q11 | Which inside jokes or relationship references are approved? | Omit unless supplied and approved; do not invent | Content polish/release |
| Q12 | Exact welcome, farewell, and decline messages? | Neutral development copy; get final approval | Phase 4/release |
| Q13 | Which observed reference elements should be adapted? Any additional verified frames needed? | Off-white priority; no exact font/timing claims | Phase 2 visual review |
| Q14 | Are specific destinations/restaurants required? | Use generic categories and suitable images; no booking/location claims | Before adding venue-specific content |
| Q15 | Is music wanted? Which licensed track and volume? | Off with no network fetch until an approved asset exists | Optional Phase 4 enhancement |
| Q16 | Are additional stages or a real multi-stop timeline required? | Keep scheduler/review scope; no extra screen by default | Before scope expansion |
| Q17 | Does a 500-character notes limit work? Are notes displayed in final summary? | Optional plain text, local safe rendering; configurable cap | Phase 3 |
| Q18 | Should draft selections survive refresh? How should browser Back behave? | Phase 1 uses in-memory state and guarded same-tab stage history; refresh/reset clears it. Confirm if the client needs persistence | Client persistence policy before release |
| Q19 | Which phone/browser versions must be supported? | Plan mobile Chrome/Safari plus desktop Chromium/Firefox/WebKit; validate Tailwind compatibility before pinning | Phase 1; real devices by release |
| Q20 | Which legal image/font assets and final palette are approved? | Use licensed optimized assets and tested contrast; proposed hex values are not confirmations | Phase 2/4 |
| Q21 | Should a decline be sent to the client at all? | No remote decline notification by default; respect exit without collecting more data | Before adding decline submissions |
| Q22 | Who may access retained answers, and what deletion/retention expectations apply? | Client/provider private access only; no public storage or extra analytics; confirm provider suitability | Phase 5/release |

## 6. What can proceed without answers

Phase 1 can establish semantic structure, CSS compilation, neutral configurable stages, state retention, focus/back navigation, and mock transport boundaries. Phases 2–4 can use clearly labeled fixtures for unresolved content, but cannot call them approved or release them as final. No real notifications can be tested without Q04/Q07 and explicit test authorization.

Immediate review priorities: Q01 (buttons), Q02 (dinner), Q04 (answer retrieval), and Q05 (hours). Obtain private personalization/media details later; do not let these block neutral foundation work.

## 7. Decision log and change control

- 2026-10-25: Phase 0 baseline created; remote main verified; checkout work retained; only documentation changed; no commit/push/deploy.
- 2026-10-25: Uploaded video sampled and visually inspected; direct TikTok inaccessible. Exact styling/motion/audio and delivery remain unverified.
- 2026-10-25: Recommended compiled Tailwind, native-module SPA, mock/live transport boundary, and conditional email-only route. No client choice was approved on their behalf.
- 2026-10-25: Follow-up user request authorizes Phase 0 documentation review/corrections, a commit on `work`, a branch push, and a pull request targeting `main`. Phase 1, merging, and deployment remain unauthorized. Product questions Q01–Q22 remain open; preservation approval does not resolve them.

- 2026-10-25: User approved Phase 0 and authorized Phase 1 from latest main, with mock data, actual mobile/desktop screenshots, tests, and GitHub review preparation. No live submissions, notifications, public deployment, or automatic merge. The neutral preview action does not resolve Q01; sample preferences do not resolve Q02. Engineering history and browser defaults are documented below.

For each future answer, record decision ID, date, who approved it, source, affected requirement IDs, and impact on plan/tests. Record approval status without copying private conversations, credentials, or real response data. Update conflicting documents together.

## 8. Implemented Phase 1 engineering defaults

Q18: same-tab History API stage entries, app Back through browser history, draft retained between stages, refresh/reset clears state, and no answers in URLs or browser storage. This implements the provisional recommendation without approving cross-refresh persistence.

Q19: Tailwind/CLI 4.3.3 pins the provisional modern-browser baseline (Chrome 111+, Safari 16.4+, Firefox 128+). Chromium 154 has been tested; client phone requirements and other engines remain unverified.

Q20: provisional design uses off-white #F8F5EF, ink #443D36, muted #70675F, and rose #92534D, with system serif/sans fonts and original local SVG artwork. These are reviewable design choices, not client-approved exact color/font values. No soundtrack, stock photo, personalized name, or venue is invented.

The latest request approves foundation work; the product questions above remain open unless their actual choices are supplied.
