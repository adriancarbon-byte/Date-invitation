# Recommended architecture

Status: proposed production design, saved during Phase 0. No application files, packages, service configuration, or workflows have been created. Source requirements: [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md). Product choices requiring approval remain in [DECISIONS_AND_OPEN_QUESTIONS.md](DECISIONS_AND_OPEN_QUESTIONS.md).

## 1. Simplest dependable approach

Use one semantic HTML entry point, small native JavaScript modules, centralized in-memory state, and static compiled CSS. Keep navigation within the page. A static invitation needs no React, Next.js, client router, custom server, database, or paid platform for the email-only option.

| Area | Recommendation | Reason and limit |
| --- | --- | --- |
| HTML | One `index.html`, accessible stage sections | Works on GitHub Pages without route rewrites |
| JavaScript | Native ES modules; no runtime framework/bundler initially | Small state and transport layers are easy to test |
| CSS | Tailwind CLI builds `src/styles.css` into `assets/css/app.css` | Static production CSS; no browser compiler |
| Transitions | A few locally served Animate.css effects plus CSS | Preserve requested stack; avoid animation on every element |
| Confetti | Locally served Canvas Confetti, loaded only when needed | Brief success-only effect; disable for reduced motion |
| Hearts | Fixed pool of CSS-animated decorative elements | Bounded memory, no unbounded spawning |
| Music | One persistent audio element, default off | Navigation does not restart it; no track is approved |
| Submission | Swappable mock/live adapter | Develop safely without notifications; test failures deterministically |
| Answer delivery | Web3Forms email, conditional on client acceptance | Does not supply private results on the invitation |
| Hosting | GitHub Pages with prebuilt assets | Free static hosting; no private response backend |
| Testing | Node built-in tests for logic; Playwright for browser flows | Date and submission logic need more than manual clicking |

If opening the original link to retrieve answers is mandatory, pause the email-only production decision and scope an authenticated backend separately. A public frontend cannot securely provide that feature. Phase 1 can proceed with mock transport while this remains open.

## 2. Proposed file structure

This tree is a future plan, **not files already created**. Create each part in its phase, not all at once.

```text
Date-invitation/
  README.md
  PROJECT_REQUIREMENTS.md
  ARCHITECTURE.md
  IMPLEMENTATION_PLAN.md
  DECISIONS_AND_OPEN_QUESTIONS.md
  REFERENCE_REVIEW.md
  VERIFICATION.md
  AGENTS.md
  .gitignore                      # dependencies, scratch output, private files
  package.json                    # exact versions and small scripts
  package-lock.json
  index.html                      # stages, one audio element, shared controls
  src/
    styles.css                    # Tailwind import, theme, custom styles
  assets/
    css/app.css                   # generated production CSS
    js/
      app.js                      # boot, event wiring, navigation, focus
      config.js                   # public choices/features, never private credentials
      state.js                    # state and controlled updates
      validation.js               # pure choice/date/time validation
      submission.js               # normalization, payload, transport, errors
      effects.js                  # bounded hearts, audio, success confetti
    vendor/                       # pinned browser distributions + license notices
    images/                       # optimized licensed activity/dinner images
    audio/                        # only when an approved legal track exists
  tests/
    validation.test.js
    submission.test.js
    navigation.spec.js
  ASSET_LICENSES.md                # asset sources, license, attribution
```

No deployment workflow is needed to start. Keep development tooling/source files out of browser imports. If copying npm runtime assets, document a deterministic copy script when introduced. Never reference `node_modules` from production HTML.

## 3. State and rendering

Suggested state shape (design contract, not implementation):

```text
screen: invitation | dinner | activity | scheduler | success | declined
answer: null | yes
dinnerId: null | configured option ID
activityId: null | city-lights | around-city | movie-date | arcade
date: null | YYYY-MM-DD (Manila calendar date)
time: null | HH:mm (Manila local time)
notes: string
errors: field -> understandable message
submission: {status: idle|pending|error|success|unknown, id, submittedAt, errorCode}
audio: {enabled, playing, blocked}
```

The declined state is a simple respectful exit panel, not an extra itinerary step; do not send a declined response remotely by default. Whether decline notifications are wanted is open. Keep validation and payload functions independent from the DOM.

Derive enabled stage order from public configuration. Do not require dinner when omitted or optional. Keep existing choices when rendering stages. Only the active stage is visible/focusable. Native radio groups or equivalent accessible controls represent mutually exclusive cards. On navigation, announce the stage and focus its heading without a scroll jump.

Use explicit app Back/Continue actions. Recommend small History API entries or hash-based stage state so browser Back can mirror stage navigation without server routes. Decide the exact policy in Phase 1; do not put selections/notes in the URL. Guard direct history navigation to stages whose prerequisites are missing. Refresh starts a new in-memory session unless a later approved policy changes it.

Avoid advancing during a card's focus event. The technical auto-advance proposal and the recommended explicit Continue control must be resolved before final Phase 2 behavior. Animation completion is never the only mechanism that unlocks navigation; reduced motion, skipped animation events, and rapid taps must still work.

## 4. Public configuration and unresolved values

Keep exact invitation copy, activity IDs/labels, allowed dates, timezone, dinner enabled/required/options, invitation variant, allowed time policy, notes limit, effect/audio toggles, and submission mode configurable.

Unresolved fields should be `null`, disabled, or clearly identified development fixtures. Do not ship a real recipient name, a real email address, a secret, an invented approved time range, or sample dinner labels presented as confirmed preferences. Without approved availability, production submission stays unavailable rather than guessing.

A normal Web3Forms form access key is public by design. Account-level secrets are not. Store the destination email in the provider configuration rather than frontend config wherever possible. The eventual public form key must be verified with the client; never request email-account passwords.

## 5. Calendar and time rules

Build the exact 32-date allowlist: `2026-10-28`, `2026-10-29`, and `2026-11-01` through `2026-11-30`. A single min/max range is insufficient because it would admit October 30/31.

Recommend a native select grouped by month, with a placeholder and all valid future choices, for this small discontinuous set. It is easier to make dependable than a custom calendar. A native date input is acceptable only with exact-set validation and clear guidance; `min`/`max` alone do not satisfy the requirement.

Use an injected clock in tests. Derive the Manila calendar day with `Intl.DateTimeFormat` and `formatToParts`, then compare ISO date strings. Do not derive permitted days with `toISOString().slice(0,10)` or render `new Date('YYYY-MM-DD')` through device-local formatting. Validate real dates rather than letting JavaScript normalize invalid dates.

Require strict `HH:mm`, then validate against the approved policy. Propose rejecting elapsed same-day times in Manila; confirm this policy before Phase 3. Do not preselect invented times. Serialize `date`, `time`, and `timezone` separately; if an instant is needed later, derive an explicit `+08:00` datetime and test it.

Revalidate on entry, edit, and submit, including if the page stays open overnight. Expired dates stay excluded; an exhausted allowlist becomes a clear unavailable state with sending disabled. Do not extend the schedule automatically.

## 6. Submission boundary

Recommended interface: `submitInvitation(normalizedPayload, {signal})` returns a normalized result. Mock and live adapters use the same interface; select mock by default in development, and never fall back silently to live mode.

Proposed allowlisted application payload:

| Field | Meaning |
| --- | --- |
| `invitation_response` | Affirmative response after the approved invitation interaction |
| `dinner_preference` | Approved display label, omitted when not collected |
| `activity` | One confirmed activity display label |
| `date` | Exact allowed `YYYY-MM-DD` date |
| `time` | Valid `HH:mm` in the stated timezone |
| `timezone` | `Asia/Manila` |
| `notes` | Optional trimmed plain text within approved length |
| `submission_id` | Opaque ID for one logical attempt; no identity encoded |
| `submitted_at` | Client-generated UTC timestamp, not a trusted server timestamp |

The Web3Forms adapter adds the public `access_key`, an appropriate nonprivate subject, and approved spam-protection fields. Do not send internal state/errors, audio settings, device metadata, recipient email, or all config values. Do not use `innerHTML` for provider messages or notes.

Use browser-side HTTPS `POST https://api.web3forms.com/submit`. Parse JSON and require both successful HTTP status and `success === true`. Non-JSON, `success:false`, 4xx/429/5xx, network errors, and abort/timeout must not unlock success. Normalize safe error messages and preserve state.

Lock the send action while pending; propose a bounded timeout (for example 15 seconds, an engineering value). Generate an ID before the first send, reuse it for an unchanged manual retry, and reset it if the payload changes. Do not automatically retry an ambiguous request: the provider may already have accepted it. Explain that delivery could be uncertain and a manual retry may duplicate the email. Frontend locking and an ID do not establish server-side deduplication; verify provider capabilities before claiming more.

After provider acceptance, discourage accidental resending. Post-submit editing or repeated responses need the Q08/Q09 decision. Frontend flags are usability controls, not enforcement across browsers/devices.

Mocks must cover success, application failure, HTTP errors, offline, timeout, malformed JSON, delayed responses, and repeated clicks. Mock success is explicitly labeled as a test and never represented as an actual email.

## 7. Production dependencies and effects

Use exact dependency versions with a lockfile and `npm ci` for later reproducibility. Registry metadata read during Phase 0 reported Tailwind and its CLI `4.3.3`, Animate.css `4.1.1`, and Canvas Confetti `1.9.4`; these are observed candidates, not installed or final compatibility approval.

Phase 1 should validate the chosen Tailwind version's browser support against the target phones before pinning it. Use the CLI package matching that Tailwind release and a small `build:css` script. Scan HTML and JS sources; keep utility names complete/static or explicitly include dynamic variants so production CSS is not missing states.

Build the CSS in cloud tooling, check it into the simple prebuilt root-publication approach, and rebuild on CSS/template changes. Keep generated CSS reproducible. Serve pinned Animate.css and confetti distributions locally with license notices; avoid production dependency on a third-party CDN. Add these only when their phase needs them.

Keep one shared audio element outside replaceable stage content. Start off, require a gesture, catch rejected playback promises, and keep navigation independent of audio. Hearts use a small fixed pool and pause/off behavior; no interval that grows the DOM forever. Confetti runs once briefly after real success, with reduced-motion disabling and bounded duration. Failure to load any effect cannot prevent scheduling/submission.

## 8. GitHub Pages delivery plan

Baseline recommendation: prebuilt root output on `main` when release is approved. Compile Tailwind in Codex Cloud and include the resulting CSS; publish only after reviewing the exact release. Native modules and `./assets/...` paths avoid a server build/router. Relative URLs inside CSS are relative to that CSS file, not the HTML; test images/fonts accordingly.

GitHub Actions is an alternative if reproducible hosted builds become useful. If chosen, publish a minimal artifact containing only required site files and pin appropriate action revisions. Do not create or enable a deploying workflow now. Separate build checks from publication.

Before any release push, inspect Pages settings and existing workflows. A publishing-branch push may deploy automatically. Branch-root hosting can expose repository documentation as public files; keep every repository file safe for public access. A build artifact is preferable if excluding documentation is desired later.

No private API, protected dashboard, or secret management can live in static Pages alone. Do not treat the expected URL as live until deployment and HTTP checks pass. Use `/Date-invitation/` in preview tests and verify CSS, modules, images, and optional audio return successfully.

## 9. Verification strategy and references

Meaningful logic tests: allowlist boundaries/timezones, state retention, payload allowlisting, and normalized submission outcomes. Meaningful browser tests: navigation/focus, selection corrections, failure/retry locking, responsive layout, reduced motion, and repository-path assets. Test details and release acceptance are in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

Official references consulted on 2026-10-25:

- [Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli): compile templates to static CSS with the CLI package.
- [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn): development-only, not a production delivery method.
- [Animate.css documentation](https://animate.style/): selective CSS animation use; project-specific motion guards are still needed.
- [Canvas Confetti project](https://github.com/catdad/canvas-confetti): browser confetti library; verify reduced-motion settings during integration.
- [Web3Forms API reference](https://docs.web3forms.com/getting-started/api-reference): browser submission endpoint, access key, response success/failure and rate limits. This is submission documentation, not proof of private retrieval or actual inbox delivery.
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): branch/folder and Actions publication options; configured source pushes can publish automatically.
