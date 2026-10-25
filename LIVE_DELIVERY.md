# Live invitation and email delivery

This update supersedes the earlier mock-only Phase 2A restrictions under the latest explicit publishing request. The existing GitHub branch remains separate from main; production is hosted as a Sites Worker.

- Live address: https://a-letter-for-christine.genialcorgi512.chatgpt.site
- Site ID: `appgprj_6ade3d1fa7e08191a7c2fa5113830f03` (source manifest belongs to the Sites checkout).
- Allowed dates remain October 28–31 and November 1–30, 2026. Past dates/times are checked in Asia/Manila on both browser and server.
- Hour, every minute, and AM/PM are available through scrollable, snapping wheels with click and keyboard support. The selected time is explicitly confirmed. Midnight/noon are converted to correct 24-hour values.
- The six existing optional food choices and four activities remain.
- Highlighted scheduler helpers, Copy our little plan and Start again are removed. The Christine message occupies the former restart area in a compact serif card. Long notes use DM Sans for readability.
- Full background heart motion remains automatic, with no animation selector.

## Delivery boundary

Reviewing or choosing answers sends nothing. **Send our plan** clearly says that the chosen date, time, foods and activity are emailed to the inviter. It POSTs only those answers and Yes to `/api/invitations`. The Worker checks the origin, payload size, date, time and allowlists, then calls Web3Forms over HTTPS.

`WEB3FORMS_ACCESS_KEY` is a secret runtime variable in Sites. The recipient is the verified inbox bound to that provider key. Neither the key nor receiving email is bundled into HTML, client JavaScript, Git source or archives. No Gmail password or session credentials are used.

The UI shows success only after an affirmative provider response. The service accepting an email does not prove inbox arrival. Sending is locked during the request; a confirmed plan is read-only for the current tab. A failure keeps choices available and allows retry. In a timeout, receipt may be uncertain; a retry can produce a duplicate. Refreshing starts a new invitation session; no cross-session deduplication or permanent answer storage is claimed. No answer values are written to server logs or storage by this code.

The download is an offline review copy. It has network access disabled and cannot send email. Share the live URL for actual responses.

## Build and verification

`npm test` covers state, validation, client transport and the relay using synthetic provider receipts, including rejection and failure paths. `npm run test:browser` uses Chromium with desktop/touch phone layouts and a fixed test clock. Browser email responses are intercepted, so the suite sends no real email. Screenshots are in `docs/previews/live-delivery/`.

`npm run build`, `npm run preview:export`, and `npm run preview:download` regenerate local CSS and the single-file review ZIP. `node scripts/build-worker.mjs <artifact-directory>` embeds the current preview and server modules into the production Worker, with same-origin connections enabled only in the hosted artifact. The source hosting manifest must be copied into the artifact before packaging. The archive contains `.openai/hosting.json` at its root and the supported entrypoint `dist/server/index.js`.

The delivery account is configured using the supplied key. No real test email has been sent by the automated checks; inbox receipt still needs a real submitted plan.

Verification for this release: all **35 Node checks** and all **29 Chromium browser checks** passed (382.415 seconds for the full browser run). Production Worker route checks passed for page serving, method/path handling and invalid submissions. ZIP content matches the exact regenerated standalone HTML. Desktop and touch-phone screenshots were inspected for the time wheels and final-note readability. The public Site is version 1, built from hosting source commit `50ba50f6875373aac6b4141ddada112324a0b021`.
