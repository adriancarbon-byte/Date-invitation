# Reliability and security review — 2026-10-26

Scope: the user's requested preventive audit of the existing Netlify invitation.
Preserve presentation and personal wording, use safe mocks, save both GitHub source
copies and avoid account or paid-service changes. No private login/dashboard has
been introduced.

## Findings and repairs

| Finding | Repair |
| --- | --- |
| Schedule expiry or focus change could clear the plan during an in-flight send, losing confirmation and inviting a duplicate retry | Freeze pending state and defer expiry checks until the request settles; keep genuine accepted receipts even if the slot expired during delivery |
| Preview-completion rendering could suppress the next expiry timer | Render again when preview work releases the busy lock |
| Older phones lack `AbortSignal.timeout` or `crypto.randomUUID` | Use a bounded AbortController/Promise race covering fetch and body parsing, and a non-security history identifier fallback |
| Denied History writes could stop initialization/navigation | Catch denied writes and keep app Back functional through stage navigation |
| Null/malformed provider receipts and failed network requests | Reject safely; never show success without HTTP success and an explicit boolean acceptance; retain uncertain-delivery wording |
| Slow input streams could occupy a serverless function indefinitely | Bound body reads to five seconds, cancel stalled/oversized streams and enforce the 2 KiB cap even without honest Content-Length |
| Media-type prefix accepted invalid types; arbitrary fields were not explicitly rejected | Parse the media type exactly, reject cross-site Fetch Metadata, enforce the payload field allowlist and safe failure responses |
| Generic validation could throw on a null input; food arrays were not length bounded | Reject invalid shapes early and bound selection counts |
| Static policy permitted arbitrary inline scripts | Hash the embedded module and use its digest in the page and production response CSP; retain data-module imports and local style support |
| Missing framing/search discovery directives | Add frame denial, no-referrer and noindex/noarchive headers; noindex is not authentication |
| Build-only publication could ship logic regressions or a stale CSP/asset export | Run unit tests before Netlify builds, then verify output allowlist, module hash, delivery origin, headers and embedded asset paths |
| One adapter test used real time and would break future builds after date expiration | Freeze the test clock; preserve actual production availability checks |
| Browser screenshots modified tracked source evidence during tests | Write generated test captures to ignored test-results/ |

## Access and privacy assessment

This is intentionally a public invitation. No account passwords or management keys
are in frontend code. The Web3Forms submit-only access key is public by provider
design and available to the submitting browser; it does not let a visitor read the
inbox. Runtime configuration remains out of Git/build artifacts. There is no answer
storage or private dashboard. CSRF/origin checks do not authenticate people or stop
a nonbrowser client from reusing a public form key. Account-level spam protection,
quotas, access policies and two-factor authentication cannot be configured from
this workspace because no Netlify/Web3Forms management connection is available.

The underlying application renders choices with textContent, uses a fixed provider
endpoint and fixed recipient account, does not log payloads, does not insert answer
HTML, and stores no answers in cookies/localStorage/sessionStorage. Background
particle pools are bounded and hidden-tab work pauses; the required full-animation
appearance is preserved. Offline exports cannot send network requests.

## Verification

Results: 48 logic/security tests passed on both Node 24 and Node 22; 33 distinct Chromium scenarios verified (full suite plus corrected fallback rerun and additional header test). The build and release checks passed; npm audit reported zero known vulnerabilities. See VERIFICATION.md for exact runs and limitations. No real email
or live synthetic submission is part of the automated checks. Third-party outages,
provider quotas/domain restrictions and exactly-once delivery remain external limits.
Operational details and recovery steps: [OPERATIONS.md](OPERATIONS.md).
