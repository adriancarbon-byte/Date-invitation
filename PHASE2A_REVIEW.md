# Phase 2A romantic redesign review

Latest revision: [CLIENT_REVISION.md](CLIENT_REVISION.md) supersedes the earlier dates, two-Yes buttons and initial screen described below.

Current follow-up revision: [HEART_REFRESH.md](HEART_REFRESH.md). It supersedes the opening exit/branding and motion/type details described at the historical Phase 2A checkpoint below.

Prepared for review on 2026-10-25 (Asia/Singapore). Scheduling uses Asia/Manila. Source: `codex/phase1-foundation`, verified commit `df96a2bdcaef6f863dd656989d788fc5c0a78caa`. Review branch: `codex/romantic-redesign`; draft PR base: `codex/phase1-foundation`. PR #2 and main remain untouched. No merge or deployment is part of this task.

## What changed

Phase 1 was a split desktop composition with a decorative panel and placeholder forms. Phase 2A replaces that with focused centered screens, warm ivory paper, a muted rose palette, locally bundled Cormorant Garamond regular/italic headings, pill buttons, small connected progress hearts, and a coordinated family of pastel illustrations. The layout follows the supplied text reference while retaining the client's off-white direction.

The six-stage mock journey now works: the exact invitation question with **Yes!**, **Yes, of course!** and stable **Not now**; a brief “HUH?? You said yes??” celebration; date/time; optional food; one of the four exact activity categories; and a confirmation preview. Native checkbox/radio cards, selected checkmarks, explicit Continue, app/browser history, focus announcements, and immutable centralized state preserve choices when editing.

The calendar permits only Oct 28–29 and Nov 1–30, 2026, excluding past Manila dates. Date/time actions and final completion validate the actual state. Calendar month controls, full date labels, arrow keys, Home/End and Escape work; the inline panel avoids popup edge clipping. Time slots are explicitly preview-only. An expired selected day/time returns to scheduling on focus/visibility, copying, final validation, or a bounded expiry timer.

The keepsake summary uses actual selected values, includes the complete exact supplied romantic note, and clearly says nothing was sent or booked. Copying is local; a selectable textarea handles clipboard restrictions. Refresh/reset clears the draft. No answer persistence, real endpoint, key, analytics, private identity, booking, music, remote font service or runtime framework is added. The existing mock adapter still returns `{mode:'mock', sent:false}`.

## Original artwork

Fifteen original SVG drawings were created for this redesign: envelope, celebration, calendar, clock, pizza, sushi, burgers, pasta, tacos, ramen, City Lights, Around the City, Movie Date, Arcade and keepsake letter. The Phase 1 flower is retained. Rounded strokes, warm pastel gradients, small shadows, heart details and consistent proportions connect the family. No emoji or third-party illustration substitutes are used. Provenance and font licensing are in [ASSET_LICENSES.md](ASSET_LICENSES.md); the standalone file also contains the font license.

## Motion and interaction

Screens fade/rise into view; the envelope rises into place; buttons lift and press; cards lift/tilt on hover; selected artwork briefly bounces; calendar opening and selected days animate; progress hearts fill; celebration and ending release a fixed pool of 22 decorative pieces for under two seconds. Particles remain near the heading, behind content. Reduced-motion removes transitions and particles. Hidden-tab decoration is paused/cleared. There are no continuous confetti loops or accumulating timers/listeners.

## Render, critique and improve

The first implementation was actually rendered and captured at desktop and mobile sizes. An independent QA workstream reviewed the images, then the following changes were made and recaptured:

| Rendered weakness | Implemented refinement |
| --- | --- |
| Calendar/preview helper text was too small on mobile | Important helper/provisional text increased to 11px, legend to 10px; personal note increased to 22px on mobile. |
| Progress said 03/06 while the scheduler eyebrow said 01 | Removed competing stage numbers from all planning eyebrows. |
| Expanded desktop calendar was unnecessarily tall | Fixed day rows at 38px desktop and 36px mobile instead of width-driven squares; kept month targets at 44px. The desktop full-page calendar capture reduced from 1411px to 1370px tall. |
| Confetti crossed summary labels and values | Bounded the particle layer to the top 360px and placed it behind the page shell. |

QA also found/fixed a skip issue when food is configured for single selection, and strengthened stale ending/copy checks. Final images were reviewed again after these changes. The expanded calendar and complete ending intentionally scroll on small screens; no content is clipped.

## Checks actually executed

| Command/check | Result |
| --- | --- |
| `npm ci --ignore-scripts` | Passed; locked build dependencies installed. |
| `npm run build` | Passed; Tailwind/CLI 4.3.3 compiled local CSS. |
| `npm run preview:export` | Passed; self-contained HTML includes CSS, module graph, SVGs, fonts and font license. |
| Rebuild/export SHA-256 comparison | Passed; CSS and preview identical for unchanged inputs. Font-license inclusion was followed by another successful deterministic export comparison. |
| `npm test` | **28 passed**, 0 failed. |
| `npm run test:browser` | **18 passed in 106.462 seconds**, Chromium 154.0.8037.57. |
| `node --check assets/js/app.js` | Passed. |
| `git diff --check` | Passed. |
| SVG checks | All 16 SVGs valid XML with no script/external resource references. |

The logic tests cover the exact 32 dates, excluded gap, Manila midnight, final expiry, same-day slots, different device timezones, state tampering, guarded transitions, optional/disabled/required/single/multiple food, all four activities, selection retention, immutable snapshots, reset, stale actions and the no-network mock boundary.

The browser checks cover both affirmative actions and exit; full mock journey; history/focus/retention; calendar labels and keyboard; invalid input; Manila rollover; food omission/skip/single mode; four single-select activities; reset/direct hash/repeated events; keyboard focus and hidden controls; desktop hover/mobile touch; local clipboard selected values; expired ending/copy; disabled JavaScript; the disconnected standalone journey; real screenshots; and the preview server's repository-file restrictions.

Responsive checks exercised **320, 390, 430, 768, 1024 and 1440 CSS-pixel widths** across the stages, reduced motion, and Chromium CSS 200% zoom. No horizontal overflow, missing assets, runtime errors, or unexpected external requests were observed in tested flows. Mobile evidence uses browser touch/mobile emulation, not physical phones.

Calculated contrast: warm body text on paper **8.21:1**, muted text on paper **4.77:1**, primary button text/background **6.05:1**, rose heading on paper **5.76:1**, and secondary button text/background **6.17:1**. These calculations and keyboard tests do not establish a full screen-reader/WCAG conformance audit.

The complete frontend asset inventory is approximately **146 KB uncompressed**, excluding font-license text and documentation screenshots; JavaScript is approximately **27 KB**. This deliberately expands the original placeholder budget for real artwork, validation, interaction and local fonts. No additional runtime dependency was added. Screenshots are documentation files and are not loaded by the invitation.

## Preview and actual screenshot locations

Download [docs/preview.html](docs/preview.html), then open the saved file in your browser. GitHub displays source until it is downloaded. The exact document completed the whole journey after browser networking was disconnected, with zero additional HTTP requests.

Desktop captures use a 1440 × 1000 viewport; mobile captures use 390 × 844 touch emulation. Files are full-page screenshots, so the calendar and ending are taller than the viewport. The synthetic screenshot/test clock is October 25, 2026; selected values are mock fixtures, not recipient responses.

| View | Desktop | Mobile |
| --- | --- | --- |
| Opening invitation | [desktop](docs/previews/phase2a/desktop-invitation.png) | [mobile](docs/previews/phase2a/mobile-invitation.png) |
| Celebration | [desktop](docs/previews/phase2a/desktop-celebration.png) | [mobile](docs/previews/phase2a/mobile-celebration.png) |
| Calendar open | [desktop](docs/previews/phase2a/desktop-calendar.png) | [mobile](docs/previews/phase2a/mobile-calendar.png) |
| Time selected | [desktop](docs/previews/phase2a/desktop-time.png) | [mobile](docs/previews/phase2a/mobile-time.png) |
| Food selected | [desktop](docs/previews/phase2a/desktop-food.png) | [mobile](docs/previews/phase2a/mobile-food.png) |
| Activity selected | [desktop](docs/previews/phase2a/desktop-activity.png) | [mobile](docs/previews/phase2a/mobile-activity.png) |
| Final summary and complete note | [desktop](docs/previews/phase2a/desktop-ending.png) | [mobile](docs/previews/phase2a/mobile-ending.png) |

## Remaining decisions and verification limits

Final food inclusion/options, actual times and same-day policy, and the accepted delivery/private retrieval model remain decisions for later work. The present samples are configurable and labeled provisional. No live service, email or inbox delivery was tested.

Only Chromium and mobile emulation were exercised. Real Safari/Firefox, physical phones, a full screen-reader audit and direct downloaded-file opening remain unverified. System Chromium blocked `file://` with `ERR_BLOCKED_BY_ADMINISTRATOR`; the exact standalone HTML passed through local HTTP with networking disabled. This environment restriction is not evidence of a broken offline artifact.

The GitHub Pages settings API was inaccessible from the environment (`Forbidden`). No deployment workflow exists in the source tree, and the redesign is pushed only to a newly created review branch. No Pages setting was enabled or changed, no Site was registered, and nothing was deployed. The draft PR target and remote branch ancestry are verified separately in the final handoff.
